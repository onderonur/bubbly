import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import socketIo from 'socket.io';
import { nanoid } from 'nanoid';
import path from 'path';
import { ID, SocketUser, ChatMessage, Maybe, JwtTokenPayload } from './types';
import {
  isDev,
  getRoomUsers,
  trimSpaces,
  isImageFile,
  createNewUser,
  isUserAlreadyInRoom,
  getSocketRoomIds,
  handleUserLeavingTheRoom,
  getUserRoomIds,
} from './utils';
import notifications, { notify } from './notifications';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import router from './routes';

const { JWT_TOKEN_SECRET } = process.env;

if (!JWT_TOKEN_SECRET) {
  throw new Error("'JWT_TOKEN_SECRET' env variable should have a value.");
}

// https://socket.io/docs/server-initialization/#With-Express
const app = express();

app.use(helmet());

app.use('/api', router);

const http = createServer(app);
const io = socketIo(http);

if (!isDev) {
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
        const roomUsers = getRoomUsers(io, appUsers, roomId, socket);
        // Send current room users to sender
        callback(roomUsers);
        if (!isUserAlreadyInRoom(io, roomId, socket)) {
          // Send the newly joined user to other room users (except sender)
          socket.to(roomId).emit('joined to room', socket.user);
          notify({
            socket,
            roomId,
            notification: notifications.joinedToRoom(socket.user),
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

  socket.on(
    'chat message',
    async (
      roomId,
      { body, file }: { body: Maybe<string>; file: Maybe<Buffer | string> },
      callback
    ) => {
      const trimmedBody = body ? trimSpaces(body) : null;
      if (!trimmedBody && !file) {
        return;
      }
      // "file" can be a Buffer or base64 string.
      // base64 string is used for react-native app here.
      let inputFile = null;
      if (file instanceof Buffer) {
        inputFile = file;
      } else if (typeof file === 'string') {
        inputFile = Buffer.from(file, 'base64');
      }
      if (inputFile) {
        const isImage = await isImageFile(inputFile);
        if (!isImage) {
          return;
        }
      }
      const newMessage: ChatMessage = {
        id: nanoid(),
        author: socket.user,
        body: trimmedBody,
        timestamp: Date.now(),
        file: inputFile,
      };
      socket.to(roomId).emit('chat message', newMessage);
      callback(newMessage);
    }
  );

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

  socket.on(
    'edit user',
    (input: Pick<SocketUser, 'username' | 'color'>, callback) => {
      const userRoomIds = getUserRoomIds(io, socket);
      const socketUser = socket.user;
      const newUsername = trimSpaces(input.username);
      if (newUsername) {
        const oldUsername = socketUser.username;
        if (newUsername && oldUsername !== newUsername) {
          socketUser.username = newUsername;
          userRoomIds.forEach((roomId) => {
            notify({
              socket,
              roomId,
              notification: notifications.editedUsername(
                oldUsername,
                newUsername
              ),
            });
          });
        }
      }

      const newColor = input.color;
      if (newColor) {
        const oldColor = socketUser.color;
        if (oldColor !== newColor) {
          socketUser.color = newColor;
          userRoomIds.forEach((roomId) => {
            notify({
              socket,
              roomId,
              notification: notifications.editedColor(
                socketUser.username,
                newColor
              ),
            });
          });
        }
      }

      appUsers.set(socketUser.id, socketUser);
      callback(socketUser);
      userRoomIds.forEach((roomId) => {
        io.to(roomId).emit('edit user', socketUser);
      });
    }
  );

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

const port = process.env.PORT || 8080;

http.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${port}`);
});
