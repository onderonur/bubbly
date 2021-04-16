import { Socket } from 'socket.io';
import { CustomSocketIoServer } from './CustomSocketIoServer';
import { SocketEvent } from '@shared/SocketIoEvents';

const socketHandler = (io: CustomSocketIoServer, socket: Socket): void => {
  const disconnecting = () => {
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
  };

  socket.on(SocketEvent.DISCONNECTING, disconnecting);
};

export default socketHandler;
