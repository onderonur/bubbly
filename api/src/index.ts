import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import socketIo from 'socket.io';
import { nanoid } from 'nanoid';
import path from 'path';
import { ID, SocketUser, ChatMessage, Maybe, JwtTokenPayload } from './types';
import {
  IS_DEV,
  getRoomUsers,
  trimSpaces,
  isImageFile,
  createNewUser,
  isUserAlreadyInRoom,
  getSocketRoomIds,
  handleUserLeavingTheRoom,
} from './utils';
import NOTIFICATIONS, { notify } from './notifications';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';

const { JWT_TOKEN_SECRET } = process.env;

if (!JWT_TOKEN_SECRET) {
  throw new Error("'JWT_TOKEN_SECRET' env variable should have a value.");
}

// https://socket.io/docs/server-initialization/#With-Express
const app = express();

app.use(helmet());

const http = createServer(app);
const io = socketIo(http);

if (!IS_DEV) {
  const relativeBuildPath = '../../client/build';
  const buildPath = path.join(__dirname, relativeBuildPath);
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    return res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// TODO: May have some way to delete users from this map.
// If we delete a user when there are no connected sockets
// for them, it will change their user info when they hit
// "refresh" on the browser, or if they are using only one
// browser tab and they get reconnected.
const appUsers = new Map<ID, SocketUser>();

io.use((socket, next) => {
  const { token } = socket.handshake.query;
  let user: Maybe<SocketUser> = null;
  try {
    if (token) {
      const verified = jwt.verify(token, JWT_TOKEN_SECRET) as JwtTokenPayload;
      const { id } = verified;
      user = appUsers.get(id);
      if (!user) {
        throw Error('User not found');
      } else {
        user.socketIds.push(socket.id);
      }
    } else {
      throw Error('Token not found');
    }
  } catch (err) {
    user = createNewUser(socket);
  }

  appUsers.set(user.id, user);

  // eslint-disable-next-line no-param-reassign
  socket.user = user;

  next();
});

io.on('connection', (socket) => {
  socket.on('who am i', (callback) => {
    const token = jwt.sign({ id: socket.user.id }, JWT_TOKEN_SECRET, {
      expiresIn: '1 week',
    });
    callback(socket.user, token);
  });

  socket.on('create room', (callback) => {
    const roomId = nanoid();
    callback(roomId);
  });

  socket.on('join room', (roomId, callback) => {
    socket.join(roomId, (err) => {
      if (!err) {
        const roomUsers = getRoomUsers(io, appUsers, roomId);
        // Send current room users to sender
        callback(roomUsers);
        if (!isUserAlreadyInRoom(io, roomId, socket)) {
          // Send the newly joined user to other room users (except sender)
          socket.to(roomId).emit('joined to room', socket.user);
          notify({
            socket,
            roomId,
            notification: NOTIFICATIONS.joinedToRoom(socket.user),
          });
        }
      }
    });
  });

  socket.on('leave room', (roomId) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.leave(roomId, (err: any) => {
      if (!err) {
        handleUserLeavingTheRoom(io, socket, roomId);
      }
    });
  });

  socket.on('chat message', async (roomId, { body, file }, callback) => {
    const trimmedBody = body ? trimSpaces(body) : null;
    if (!trimmedBody && !file) {
      return;
    }
    if (file) {
      const isImage = await isImageFile(file);
      if (!isImage) {
        return;
      }
    }
    const newMessage: ChatMessage = {
      id: nanoid(),
      author: socket.user,
      body: trimmedBody,
      timestamp: Date.now(),
      file,
    };
    socket.to(roomId).emit('chat message', newMessage);
    callback(newMessage);
  });

  // TODO: May add this feature later.
  // socket.on('message received', (roomId, messageId, userId) => {
  //   socket.to(roomId).emit('message received', messageId, userId);
  // });

  socket.on('started typing', (roomId: ID) => {
    socket.to(roomId).emit('started typing', socket.user);
  });

  socket.on('finished typing', (roomId: ID) => {
    socket.to(roomId).emit('finished typing', socket.user);
  });

  socket.on('edit user', (roomId: string, input: SocketUser) => {
    const editedUser = appUsers.get(input.id);
    if (editedUser) {
      const newUsername = trimSpaces(input.username);
      if (newUsername) {
        const oldUsername = editedUser.username;
        if (newUsername && oldUsername !== newUsername) {
          editedUser.username = newUsername;
          notify({
            socket,
            roomId,
            notification: NOTIFICATIONS.editedUsername(
              oldUsername,
              newUsername
            ),
          });
        }
      }

      const newColor = input.color;
      if (newColor) {
        const oldColor = editedUser.color;
        if (oldColor !== newColor) {
          editedUser.color = newColor;
          notify({
            socket,
            roomId,
            notification: NOTIFICATIONS.editedColor(
              editedUser.username,
              newColor
            ),
          });
        }
      }

      // eslint-disable-next-line no-param-reassign
      socket.user = editedUser;
      appUsers.set(editedUser.id, editedUser);
      io.to(roomId).emit('edit user', editedUser);
    }
  });

  socket.on('disconnecting', () => {
    // User leaves all of the rooms before "disconnected".
    // So, if we want to get the rooms those the user joined,
    // we need to do this in "disconnecting" event.
    // https://stackoverflow.com/a/52713972/10876256
    const roomIds = getSocketRoomIds(socket);

    roomIds.forEach((roomId) => {
      handleUserLeavingTheRoom(io, socket, roomId);
    });

    // Remove the leaving socket from users socketId list.
    // eslint-disable-next-line no-param-reassign
    socket.user.socketIds = socket.user.socketIds.filter(
      (socketId) => socketId !== socket.id
    );

    appUsers.set(socket.user.id, socket.user);
  });
});

const PORT = process.env.PORT || 8080;

http.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${PORT}`);
});
