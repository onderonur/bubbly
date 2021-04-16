import socketIo from 'socket.io';
import notifications, { notify } from '../notifications/notifications.utils';
import { SocketUser } from '../users/SocketUser';
import { ID, Maybe } from '@shared/SharedTypes';
import { ChatEvent, RoomsEvent } from '@shared/SocketIoEvents';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

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

  getSocketUsers = (): SocketUser[] => {
    return [...this.socketUsers.values()];
  };

  getSocketUserById = (userId: ID): Maybe<SocketUser> => {
    return this.socketUsers.get(userId);
  };

  getRoomSockets = async (
    roomId: ID,
  ): Promise<socketIo.RemoteSocket<DefaultEventsMap>[]> => {
    const roomSockets = await this.in(roomId).fetchSockets();
    return roomSockets;
  };

  getSocketById = (socketId: ID): Maybe<socketIo.Socket> => {
    // get a socket by ID in the main namespace
    // https://socket.io/docs/v3/migrating-from-2-x-to-3-0/
    const socket = this.of('/').sockets.get(socketId);
    return socket;
  };

  getUserBySocketId = (socketId: ID): Maybe<SocketUser> => {
    const socket = this.getSocketById(socketId);
    return socket?.user;
  };

  getRoomUsers = async (roomId: ID): Promise<SocketUser[]> => {
    const roomSockets = await this.getRoomSockets(roomId);
    const roomUsers: SocketUser[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const roomSocket of roomSockets) {
      const user = this.getUserBySocketId(roomSocket.id);
      if (user && !roomUsers.some((roomUser) => roomUser.id === user.id)) {
        roomUsers.push(user);
      }
    }
    return roomUsers;
  };

  isUserAlreadyInRoom = async (
    roomId: ID,
    user: SocketUser,
  ): Promise<boolean> => {
    const roomUsers = await this.getRoomUsers(roomId);
    return roomUsers.some((roomUser) => roomUser.id === user.id);
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
    const roomSockets = await this.getRoomSockets(roomId);
    // We're checking if the remaining sockets has the leaving user.
    // If not, it means that user is leaving the room completely and
    // they have no other socket connection to this room.
    const userHasAnotherSocketInRoom = roomSockets.some((roomSocket) => {
      if (roomSocket.id === leavingSocket.id) {
        return false;
      }
      const roomSocketUser = this.getUserBySocketId(roomSocket.id);
      return roomSocketUser && roomSocketUser.id === leavingSocket.user.id;
    });
    return !userHasAnotherSocketInRoom;
  };

  handleUserLeavingTheRoom = async (
    socket: socketIo.Socket,
    roomId: ID,
  ): Promise<void> => {
    const socketUser = socket.user;
    socket.to(roomId).emit(ChatEvent.FINISHED_TYPING, socketUser);
    // One of the sockets of user may leave the room.
    // But user's other socket may still be in the room.
    // So, we check if there are any remaining sockets of user
    // in the room or not.
    const didUserLeaveTheRoomCompletely = await this.didUserLeaveTheRoomCompletely(
      roomId,
      socket,
    );
    if (didUserLeaveTheRoomCompletely) {
      socket.to(roomId).emit(RoomsEvent.LEFT_THE_ROOM, socketUser);
      notify({
        socket,
        roomId,
        notification: notifications.leftTheRoom(socketUser),
      });
    }
  };
}
