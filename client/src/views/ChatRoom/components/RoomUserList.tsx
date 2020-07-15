import React from 'react';
import { List } from '@material-ui/core';
import Scrollbar from 'react-scrollbars-custom';
import { useRoomUsers } from '../contexts/RoomUsersContext';
import RoomUserListItem from './RoomUserListItem';
import { ID } from 'types';

interface RoomUserListProps {
  roomId: ID;
}

const RoomUserList = React.memo<RoomUserListProps>(function RoomUserList({
  roomId,
}) {
  const { roomUsers } = useRoomUsers();

  return (
    <Scrollbar>
      <List dense>
        {roomUsers.map((user) => {
          return (
            <RoomUserListItem key={user.id} roomUser={user} roomId={roomId} />
          );
        })}
      </List>
    </Scrollbar>
  );
});

export default RoomUserList;
