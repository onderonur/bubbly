import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useRoomUsers } from '../contexts/RoomUsersContext';
import { Typography, IconButton } from '@material-ui/core';

interface RoomUserCounter {
  onClick?: VoidFunction;
}

const RoomUserCounter = React.memo<RoomUserCounter>(function RoomUserCounter({
  onClick,
}) {
  const roomUsers = useRoomUsers();

  const content = (
    <Typography component="span" color="primary" variant="body2">
      <VisibilityIcon />
      {roomUsers.length}
    </Typography>
  );

  if (!onClick) {
    return content;
  }

  return (
    <IconButton size="small" onClick={onClick}>
      {content}
    </IconButton>
  );
});

export default RoomUserCounter;
