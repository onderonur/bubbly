import React from 'react';
import { List } from '@material-ui/core';
import Scrollbar from 'react-scrollbars-custom';
import { useRoomUsers } from '../contexts/RoomUsersContext';
import RoomUserListItem from './RoomUserListItem';
import { ID } from 'types';
import { useViewer } from 'contexts/ViewerContext';

interface RoomUserListProps {
  roomId: ID;
}

const RoomUserList = React.memo<RoomUserListProps>(function RoomUserList({
  roomId,
}) {
  const roomUsers = useRoomUsers();
  const viewer = useViewer();

  return (
    <Scrollbar>
      <List dense>
        {viewer && <RoomUserListItem roomUser={viewer} roomId={roomId} />}
        {roomUsers
          .filter((user) => user.id !== viewer?.id)
          .map((user) => {
            return (
              <RoomUserListItem key={user.id} roomUser={user} roomId={roomId} />
            );
          })}
      </List>
    </Scrollbar>
  );
});

export default RoomUserList;
