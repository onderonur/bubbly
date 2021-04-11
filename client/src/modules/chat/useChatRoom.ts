import { ID, SocketUser } from 'modules/shared/SharedTypes';
import useSocketIo, {
  useSocketManagerListener,
} from 'modules/socket-io/SocketIoContext';
import { useCallback, useEffect } from 'react';
import { useRoomUsers } from 'modules/room-users/RoomUsersContext';

function useChatRoom(roomId: ID) {
  const { setRoomUsers } = useRoomUsers();

  const socket = useSocketIo();

  const joinRoom = useCallback(() => {
    socket?.emit('join room', roomId, (users: SocketUser[]) => {
      setRoomUsers(users);
    });
  }, [socket, roomId, setRoomUsers]);

  useEffect(() => {
    joinRoom();
    return () => {
      socket?.emit('leave room', roomId);
    };
  }, [socket, joinRoom, roomId]);

  const handleReconnect = useCallback(() => {
    joinRoom();
  }, [joinRoom]);

  useSocketManagerListener('reconnect', handleReconnect);
}

export default useChatRoom;
