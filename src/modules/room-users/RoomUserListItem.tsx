import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useViewer } from '@src/modules/viewer/ViewerContext';
import { SocketUser } from '../shared/SharedTypes';

interface RoomUserListItemProps {
  roomUser: SocketUser;
}

const RoomUserListItem = React.memo<RoomUserListItemProps>(
  function RoomUserListItem({ roomUser }) {
    const { viewer, startEditing } = useViewer();
    const isViewer = viewer?.id === roomUser.id;

    return (
      <ListItem divider>
        <ListItemText
          primary={roomUser.username}
          primaryTypographyProps={{
            noWrap: true,
            color: isViewer ? 'primary' : 'initial',
          }}
        />
        {isViewer && (
          <ListItemSecondaryAction>
            <IconButton onClick={startEditing}>
              <SettingsIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );
  },
);

export default RoomUserListItem;
