import { ID, Maybe } from '@shared/SharedTypes';
import { nanoid } from 'nanoid';
import socketIo from 'socket.io';
import jwt from 'jsonwebtoken';
import { CustomSocketIoServer } from '../socket/CustomSocketIoServer';
import { JwtTokenPayload } from './users.types';

const { JWT_TOKEN_SECRET } = process.env;

if (!JWT_TOKEN_SECRET) {
  throw new Error("'JWT_TOKEN_SECRET' env variable should have a value.");
}

export class SocketUser {
  id: ID;
  username: string;
  socketIds: ID[];
  color: string;

  constructor(socket: socketIo.Socket) {
    this.id = nanoid();
    this.username = `User-${nanoid(6)}`;
    this.socketIds = [socket.id];
    this.color = this.generateRandomHexColor();
  }

  // https://stackoverflow.com/a/5092872/10876256
  private generateRandomHexColor = (): string => {
    return '#000000'.replace(/0/g, () =>
      Math.floor(Math.random() * 16).toString(16),
    );
  };

  addSocket = (socket: socketIo.Socket): void => {
    this.socketIds.push(socket.id);
  };

  removeSocket = (socket: socketIo.Socket): void => {
    this.socketIds = this.socketIds.filter(
      (socketId) => socketId !== socket.id,
    );
  };

  hasSocket = (socketId: ID): boolean => {
    return this.socketIds.includes(socketId);
  };

  static findOrCreateSocketUser = (
    io: CustomSocketIoServer,
    socket: socketIo.Socket,
  ): SocketUser => {
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

    return user;
  };
}
