import { SocketUser } from '../users/SocketUser';

declare module 'socket.io' {
  class Socket {
    user: SocketUser;
  }
}
