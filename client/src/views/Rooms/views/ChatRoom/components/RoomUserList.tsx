import React from 'react';
import { List } from '@material-ui/core';
import Scrollbar from 'react-scrollbars-custom';
import { useRoomUsers } from '../contexts/RoomUsersContext';
import RoomUserListItem from './RoomUserListItem';

const RoomUserList = React.memo(function RoomUserList() {
  const { roomUsers } = useRoomUsers();

  return (
    <Scrollbar>
      <List>
        {roomUsers.map((user) => {
          return <RoomUserListItem key={user.id} roomUser={user} />;
        })}
      </List>
    </Scrollbar>
  );
});

export default RoomUserList;
