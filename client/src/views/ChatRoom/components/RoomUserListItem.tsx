import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useViewer } from 'contexts/ViewerContext';
import { SocketUser, ID } from 'types';
import useBaseDialog from '../../../components/BaseDialog/hooks/useBaseDialog';
import RoomUserFormModal from './RoomUserFormModal';

interface RoomUserListItemProps {
  roomUser: SocketUser;
  roomId: ID;
}

const RoomUserListItem = React.memo<RoomUserListItemProps>(
  function RoomUserListItem({ roomUser, roomId }) {
    const viewer = useViewer();
    const isViewer = viewer?.id === roomUser.id;

    const { isOpen, openDialog, closeDialog } = useBaseDialog();

    return (
      <>
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
              <IconButton size="small" onClick={openDialog}>
                <SettingsIcon />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <RoomUserFormModal
          roomId={roomId}
          roomUser={roomUser}
          open={isOpen}
          onClose={closeDialog}
        />
      </>
    );
  }
);

export default RoomUserListItem;
