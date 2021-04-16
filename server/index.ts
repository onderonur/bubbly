import 'dotenv/config';
import express, { Request, Response } from 'express';
import next from 'next';
import http from 'http';
import { CustomSocketIoServer } from './socket/CustomSocketIoServer';
import { convertMBToByte } from './shared/shared.utils';
import { SocketUser } from './users/SocketUser';
import socketHandler from './socket/socket.handler';
import usersHandler from './users/users.handler';
import roomsHandler from './rooms/rooms.handler';
import chatHandler from './chat/chat.handler';
import { registerHelmet } from './security/security.utils';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const expressApp = express();

  registerHelmet(expressApp);

  const maxMessageSizeInMB = 2;
  const httpServer = http.createServer(expressApp);
  const io = new CustomSocketIoServer(httpServer, {
    // Max size for a message
    // TODO: We need a way to handle exceptions
    // those caused by this option on the client side.
    maxHttpBufferSize: convertMBToByte(maxMessageSizeInMB),
  });

  io.use((socket, nextFn) => {
    const user = SocketUser.findOrCreateSocketUser(io, socket);
    io.addSocketUser(user);
    // eslint-disable-next-line no-param-reassign
    socket.user = user;
    nextFn();
  });

  io.on('connection', (socket) => {
    socketHandler(io, socket);
    usersHandler(io, socket);
    roomsHandler(io, socket);
    chatHandler(io, socket);
  });

  expressApp.all('*', (req: Request, res: Response) => nextHandler(req, res));

  const port = process.env.PORT ?? 3000;

  httpServer.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
  });
});
