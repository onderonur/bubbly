import { ID } from './types';
import { nanoid } from 'nanoid';
import socketIo from 'socket.io';

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
}
