import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import { SocketUser, ID } from 'types';
import { useSocketListener } from 'contexts/SocketIoContext';
import produce from 'immer';

interface RoomUsersContextValue {
  roomUsers: SocketUser[];
  setRoomUsers: React.Dispatch<React.SetStateAction<SocketUser[]>>;
}

const RoomUsersContext = React.createContext<RoomUsersContextValue>(
  {} as RoomUsersContextValue
);

export function useRoomUsers() {
  const roomUsers = useContext(RoomUsersContext);
  return roomUsers;
}

type RoomUsersProviderProps = React.PropsWithChildren<{
  roomId: ID;
}>;

function RoomUsersProvider({ roomId, children }: RoomUsersProviderProps) {
  const [roomUsers, setRoomUsers] = useState<SocketUser[]>([]);

  useEffect(() => {
    return () => {
      setRoomUsers([]);
    };
  }, [roomId]);

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

  const contextValue = useMemo<RoomUsersContextValue>(
    () => ({ roomUsers, setRoomUsers }),
    [roomUsers]
  );

  return (
    <RoomUsersContext.Provider value={contextValue}>
      {children}
    </RoomUsersContext.Provider>
  );
}

export default RoomUsersProvider;
