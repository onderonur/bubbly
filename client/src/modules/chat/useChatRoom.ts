import { ID, SocketUser } from 'modules/shared/SharedTypes';
import useSocketIo, {
  useSocketListener,
} from 'modules/socket-io/SocketIoContext';
import { useCallback, useEffect } from 'react';
import { useRoomUsers } from 'modules/room-users/RoomUsersContext';

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
