import { ID } from '@shared/SharedTypes';
import {
  useSocketIo,
  useSocketManagerListener,
} from '@src/modules/socket-io/SocketIoContext';
import { useCallback, useEffect } from 'react';
import { useRoomUsers } from '@src/modules/room-users/RoomUsersContext';
import { RoomsEvent, SocketEvent } from '@shared/SocketIoEvents';
import { SocketUser } from '@src/modules/shared/SharedTypes';

function useChatRoom(roomId: ID) {
  const { setRoomUsers } = useRoomUsers();

  const socket = useSocketIo();

  const joinRoom = useCallback(() => {
    socket.emit(RoomsEvent.JOIN_ROOM, roomId, (users: SocketUser[]) => {
      setRoomUsers(users);
    });
  }, [socket, roomId, setRoomUsers]);

  useEffect(() => {
    joinRoom();
    return () => {
      socket.emit(RoomsEvent.LEAVE_ROOM, roomId);
    };
  }, [socket, joinRoom, roomId]);

  const handleReconnect = useCallback(() => {
    joinRoom();
  }, [joinRoom]);

  useSocketManagerListener(SocketEvent.RECONNECT, handleReconnect);
}

export default useChatRoom;
