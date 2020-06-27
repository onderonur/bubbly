import React, { useState, useCallback, useContext, useEffect } from 'react';
import { SocketUser, ID } from 'types';
import useSocketIo, { useSocketListener } from 'contexts/SocketContext';
import produce from 'immer';

const RoomUsersContext = React.createContext<SocketUser[]>([]);

export function useRoomUsers() {
  const roomUsers = useContext(RoomUsersContext);
  return roomUsers;
}

type RoomUsersProviderProps = React.PropsWithChildren<{
  roomId: ID;
}>;

function RoomUsersProvider({ roomId, children }: RoomUsersProviderProps) {
  const [roomUsers, setRoomUsers] = useState<SocketUser[]>([]);

  const handleJoinedToRoom = useCallback((roomUser: SocketUser) => {
    setRoomUsers(
      produce((draft: SocketUser[]) => {
        draft.push(roomUser);
      })
    );
  }, []);

  useSocketListener('joined to room', handleJoinedToRoom);

  const handleLeftTheRoom = useCallback((roomUser: SocketUser) => {
    setRoomUsers((current) =>
      current.filter((user) => user.id !== roomUser.id)
    );
  }, []);

  useSocketListener('left the room', handleLeftTheRoom);

  const handleEditUser = useCallback((socketUser: SocketUser) => {
    setRoomUsers((current) => {
      return current.map((user) => {
        if (user.id === socketUser.id) {
          return socketUser;
        }
        return user;
      });
    });
  }, []);

  useSocketListener('edit user', handleEditUser);

  const io = useSocketIo();

  const joinRoom = useCallback(() => {
    io?.emit('join room', roomId, (users: SocketUser[]) => {
      setRoomUsers(users);
    });
  }, [io, roomId]);

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

  return (
    <RoomUsersContext.Provider value={roomUsers}>
      {children}
    </RoomUsersContext.Provider>
  );
}

export default RoomUsersProvider;
