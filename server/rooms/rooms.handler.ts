import { Socket } from 'socket.io';
import { CustomSocketIoServer } from '../socket/CustomSocketIoServer';
import { SocketUser } from '../users/SocketUser';
import { ID } from '@shared/SharedTypes';
import { nanoid } from 'nanoid';
import notifications, { notify } from '../notifications/notifications.utils';
import { RoomsEvent } from '@shared/SocketIoEvents';

const roomsHandler = (io: CustomSocketIoServer, socket: Socket): void => {
  const createRoom = (callback: (roomId: ID) => void) => {
    const roomId = nanoid();
    callback(roomId);
  };

  const joinRoom = async (
    roomId: ID,
    callback: (roomUsers: SocketUser[]) => void,
  ) => {
    const socketUser = socket.user;
    // Checking if the user is already in room before joining with a new socket.
    const isUserAlreadyInRoom = await io.isUserAlreadyInRoom(
      roomId,
      socketUser,
    );
    await socket.join(roomId);
    if (!isUserAlreadyInRoom) {
      // Send the newly joined user info to other room users (except sender)
      socket.to(roomId).emit(RoomsEvent.JOINED_TO_ROOM, socketUser);
      notify({
        socket,
        roomId,
        notification: notifications.joinedToRoom(socketUser),
      });
    }
    const roomUsers = await io.getRoomUsers(roomId);
    const sortedRoomUsers: SocketUser[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const roomUser of roomUsers) {
      if (roomUser.id === socketUser.id) {
        // We put the viewer as the first user in the list.
        sortedRoomUsers.unshift(roomUser);
      } else {
        sortedRoomUsers.push(roomUser);
      }
    }
    // Send current room users to sender
    callback(roomUsers);
  };

  const leaveRoom = async (roomId: ID) => {
    await socket.leave(roomId);
    await io.handleUserLeavingTheRoom(socket, roomId);
  };

  socket.on(RoomsEvent.CREATE_ROOM, createRoom);
  socket.on(RoomsEvent.JOIN_ROOM, joinRoom);
  socket.on(RoomsEvent.LEAVE_ROOM, leaveRoom);
};

export default roomsHandler;
