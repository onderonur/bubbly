import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { nanoid } from 'nanoid';
import path from 'path';
import { ID, Maybe, JwtTokenPayload } from './types';
import { IS_DEV, trimSpaces, convertMBToByte } from './utils';
import notifications, { notify } from './notifications';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import router from './routes';
import { errorHandler } from './middlewares';
import cors from 'cors';
import { SocketUser } from './SocketUser';
import { CustomSocketIoServer } from './CustomSocketIoServer';
import { ChatMessage, ChatMessageInput } from './ChatMessage';

const { JWT_TOKEN_SECRET } = process.env;

if (!JWT_TOKEN_SECRET) {
  throw new Error("'JWT_TOKEN_SECRET' env variable should have a value.");
}

// https://socket.io/docs/server-initialization/#With-Express
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // "unsafe-inline" is needed to serve SPA.
        defaultSrc: ["'self'", "'unsafe-inline'"],
        // "unsafe-inline" is needed to serve SPA.
        scriptSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  }),
);

// Because we don't use proxy requests in development mode web client,
// we set CORS here.
if (IS_DEV) {
  app.use(cors());
}

app.use('/api', router);

const maxMessageSizeInMB = 2;

const httpServer = createServer(app);
const io = new CustomSocketIoServer(httpServer, {
  path: '/socket-io',
  // Max size for a message
  // TODO: We need a way to handle exceptions
  // those caused by this option on the client side.
  maxHttpBufferSize: convertMBToByte(maxMessageSizeInMB),
  cors: IS_DEV
    ? {
        origin: 'http://localhost:3000',
      }
    : undefined,
});

// To statically serve SPA client
if (!IS_DEV) {
  const relativeBuildPath = '../../client/build';
  const buildPath = path.join(__dirname, relativeBuildPath);
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    return res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.use(errorHandler);

io.use((socket, next) => {
  const { token } = socket.handshake.query;
  let user: Maybe<SocketUser> = null;
  try {
    if (typeof token === 'string') {
      const verified = jwt.verify(token, JWT_TOKEN_SECRET) as JwtTokenPayload;
      const { id } = verified;
      user = io.getSocketUserById(id);
      if (!user) {
        throw Error('User not found');
      } else {
        user.addSocket(socket);
      }
    } else {
      throw Error('Token not found');
    }
  } catch (err) {
    user = new SocketUser(socket);
  }

  io.addSocketUser(user);

  // eslint-disable-next-line no-param-reassign
  socket.user = user;

  next();
});

io.on('connection', (socket) => {
  socket.on('who am i', (callback) => {
    const socketUser = socket.user;
    const token = jwt.sign({ id: socketUser.id }, JWT_TOKEN_SECRET, {
      expiresIn: '1 week',
    });
    callback(socketUser, token);
  });

  socket.on('create room', (callback) => {
    const roomId = nanoid();
    callback(roomId);
  });

  socket.on('join room', async (roomId, callback) => {
    await socket.join(roomId);
    const roomUsers = await io.getRoomUsers(roomId, socket);
    // Send current room users to sender
    callback(roomUsers);
    const isUserAlreadyInRoom = await io.isUserAlreadyInRoom(roomId, socket);
    if (!isUserAlreadyInRoom) {
      // Send the newly joined user info to other room users (except sender)
      socket.to(roomId).emit('joined to room', socket.user);
      notify({
        socket,
        roomId,
        notification: notifications.joinedToRoom(socket.user),
      });
    }
  });

  socket.on('leave room', async (roomId) => {
    await socket.leave(roomId);
    await io.handleUserLeavingTheRoom(socket, roomId);
  });

  socket.on(
    'chat message',
    async (roomId, { body, file }: ChatMessageInput, callback) => {
      const newMessage = await ChatMessage.createChatMessage({
        socket,
        body,
        file,
      });
      socket.to(roomId).emit('chat message', newMessage);
      callback(newMessage);
    },
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
      const socketUser = socket.user;
      const userRoomIds = io.getUserRoomIds(socket);
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
                newUsername,
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
                newColor,
              ),
            });
          });
        }
      }

      io.updateSocketUser(socketUser);
      callback(socketUser);
      io.to(userRoomIds).emit('edit user', socketUser);
    },
  );

  socket.on('disconnecting', () => {
    // User leaves all of the rooms before "disconnected".
    // So, if we want to get the rooms those the user joined,
    // we need to do this in "disconnecting" event.
    // https://stackoverflow.com/a/52713972/10876256
    const roomIds = io.getSocketRoomIds(socket);

    roomIds.forEach((roomId) => {
      io.handleUserLeavingTheRoom(socket, roomId);
    });

    // Remove the leaving socket from users socketId list.
    // eslint-disable-next-line no-param-reassign
    socket.user.removeSocket(socket);

    // TODO: Bunu bi kontrol etmek lazım eskisi alttaki gibiydi. Gereksiz olabilir.
    // io.socketUsers.set(socket.user.id, socket.user);
    io.updateSocketUser(socket.user);
  });
});

const port = process.env.PORT || 8080;

httpServer.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${port}`);
});
