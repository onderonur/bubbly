import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import { ID } from '@shared/SharedTypes';
import { useSocketListener } from '@src/modules/socket-io/SocketIoContext';
import produce from 'immer';
import { RoomsEvent, UsersEvent } from '@shared/SocketIoEvents';
import { SocketUser } from '../shared/SharedTypes';

interface RoomUsersContextValue {
  roomUsers: SocketUser[];
  setRoomUsers: React.Dispatch<React.SetStateAction<SocketUser[]>>;
}

const RoomUsersContext = React.createContext<RoomUsersContextValue>(
  {} as RoomUsersContextValue,
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
      }),
    );
  }, []);

  useSocketListener(RoomsEvent.JOINED_TO_ROOM, handleJoinedToRoom);

  const handleLeftTheRoom = useCallback((roomUser: SocketUser) => {
    setRoomUsers((current) =>
      current.filter((user) => user.id !== roomUser.id),
    );
  }, []);

  useSocketListener(RoomsEvent.LEFT_THE_ROOM, handleLeftTheRoom);

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

  useSocketListener(UsersEvent.EDIT_USER, handleEditUser);

  const contextValue = useMemo<RoomUsersContextValue>(
    () => ({ roomUsers, setRoomUsers }),
    [roomUsers],
  );

  return (
    <RoomUsersContext.Provider value={contextValue}>
      {children}
    </RoomUsersContext.Provider>
  );
}

export default RoomUsersProvider;
