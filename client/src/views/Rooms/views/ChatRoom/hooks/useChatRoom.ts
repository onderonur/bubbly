import { ID, SocketUser } from 'types';
import useSocketIo, { useSocketListener } from 'contexts/SocketIoContext';
import { useCallback, useEffect } from 'react';
import { useRoomUsers } from '../contexts/RoomUsersContext';

function useChatRoom(roomId: ID) {
  const { setRoomUsers } = useRoomUsers();

  const io = useSocketIo();

  const joinRoom = useCallback(() => {
    io?.emit('join room', roomId, (users: SocketUser[]) => {
      setRoomUsers(users);
    });
  }, [io, roomId, setRoomUsers]);

  useEffect(() => {
    joinRoom();
    return () => {
      io?.emit('leave room', roomId);
    };
  }, [io, joinRoom, roomId]);

  const handleReconnect = useCallback(() => {
    joinRoom();
  }, [joinRoom]);

  useSocketListener('reconnect', handleReconnect);
}

export default useChatRoom;
