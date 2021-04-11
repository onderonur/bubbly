import socketIo from 'socket.io';
import notifications, { notify } from './notifications';
import { SocketUser } from './SocketUser';
import { ID, Maybe } from './types';

export class CustomSocketIoServer extends socketIo.Server {
  // TODO: May have some way to delete users from this map.
  // If we delete a user when there are no connected sockets
  // for them, it will change their user info when they hit
  // "refresh" on the browser, or if they are using only one
  // browser tab and they get reconnected.
  socketUsers = new Map<ID, SocketUser>();

  addSocketUser = (socketUser: SocketUser): void => {
    this.socketUsers.set(socketUser.id, socketUser);
  };

  // TODO: Bu gereksiz olabilir. Kullanıldıkları yerlere bi bakmak lazım.
  updateSocketUser = (socketUser: SocketUser): void => {
    this.socketUsers.set(socketUser.id, socketUser);
  };

  getSocketUsers = (): SocketUser[] => {
    return [...this.socketUsers.values()];
  };

  getSocketUserById = (userId: ID): Maybe<SocketUser> => {
    return this.socketUsers.get(userId);
  };

  getRoomSocketIds = async (roomId: ID): Promise<ID[]> => {
    const roomSockets = await this.in(roomId).fetchSockets();
    return roomSockets.map((roomSocket) => roomSocket.id);
  };

  getUserBySocketId = (socketId: ID): Maybe<SocketUser> => {
    // eslint-disable-next-line no-restricted-syntax
    for (const onlineUser of this.getSocketUsers()) {
      if (onlineUser.hasSocket(socketId)) {
        return onlineUser;
      }
    }
    return null;
  };

  getRoomUsers = async (
    roomId: ID,
    socket: socketIo.Socket,
  ): Promise<SocketUser[]> => {
    const roomSocketIds = await this.getRoomSocketIds(roomId);
    const roomUsers: SocketUser[] = [];
    const socketUser = this.getUserBySocketId(socket.id);
    if (socketUser) {
      // Placing socketUser as the first in array
      roomUsers.push(socketUser);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const roomSocketId of roomSocketIds) {
      const user = this.getUserBySocketId(roomSocketId);
      if (user && !roomUsers.some((roomUser) => roomUser.id === user.id)) {
        roomUsers.push(user);
      }
    }
    return roomUsers;
  };

  isUserAlreadyInRoom = async (
    roomId: ID,
    joiningSocket: socketIo.Socket,
  ): Promise<boolean> => {
    // Getting user's socket ids other than
    // the current one joining to the room.
    const otherUserSocketIds = joiningSocket.user.socketIds.filter(
      (socketId) => socketId !== joiningSocket.id,
    );
    // If user has no other sockets,
    // it means it's the first time they are joining
    if (!otherUserSocketIds.length) {
      return false;
    }
    const roomSocketIds = await this.getRoomSocketIds(roomId);
    // If any of the user's other socket ids is in room
    // it means, they are already in the room.
    return otherUserSocketIds.some((socketId) =>
      roomSocketIds.includes(socketId),
    );
  };

  getSocketRoomIds = (socket: socketIo.Socket): ID[] => {
    const socketRoomIds = [...socket.rooms.keys()];
    return socketRoomIds;
  };

  getUserRoomIds = (socket: socketIo.Socket): ID[] => {
    const { socketIds } = socket.user;
    const roomIds: ID[] = [];
    socketIds.forEach((socketId) => {
      const socketRoomIds = this.sockets.adapter.sids.get(socketId);
      socketRoomIds?.forEach((roomId) => {
        if (!roomIds.includes(roomId)) {
          roomIds.push(roomId);
        }
      });
    });
    return roomIds;
  };

  didUserLeaveTheRoomCompletely = async (
    roomId: ID,
    leavingSocket: socketIo.Socket,
  ): Promise<boolean> => {
    const leavingUser = leavingSocket.user;
    const leavingSocketId = leavingSocket.id;
    // Getting user's socket ids other than the current one
    // leaving the room.
    const remainingUserSocketIds = leavingUser.socketIds.filter(
      (socketId) => socketId !== leavingSocketId,
    );
    // If user has no other socket id, it means they
    // completely disconnecting.
    if (!remainingUserSocketIds.length) {
      return true;
    }
    const roomSocketIds = await this.getRoomSocketIds(roomId);
    // If none of the user's remaining socket ids is in the room,
    // it means they left the room completely.
    return remainingUserSocketIds.every(
      (socketId) => !roomSocketIds.includes(socketId),
    );
  };

  handleUserLeavingTheRoom = async (
    socket: socketIo.Socket,
    roomId: ID,
  ): Promise<void> => {
    const socketUser = socket.user;
    socket.to(roomId).emit('finished typing', socketUser);
    // One of the sockets of user may leave the room.
    // But user's other socket may still be in the room.
    // So, we check if there are any remaining sockets of user
    // in the room or not.
    if (await this.didUserLeaveTheRoomCompletely(roomId, socket)) {
      socket.to(roomId).emit('left the room', socketUser);
      notify({
        socket,
        roomId,
        notification: notifications.leftTheRoom(socketUser),
      });
    }
  };
}
