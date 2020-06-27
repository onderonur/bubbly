import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Prompt } from 'react-router-dom';
import Conversation from './components/Conversation';
import RoomUserList from './components/RoomUserList';
import {
  Grid,
  Box,
  Paper,
  Drawer,
  IconButton,
  Divider,
  Typography,
} from '@material-ui/core';
import RoomUsersProvider from './contexts/RoomUsersContext';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import useIsMobile from 'hooks/useIsMobile';
import OnlyOnMobile from 'components/OnlyOnMobile';
import { Bold } from 'components/Text';
import { ChatRoomRouteParams } from 'components/Routes';
import { useAppLayout } from 'components/AppLayout';

const DRAWER_WIDTH = '100%';

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: ${DRAWER_WIDTH};
  }
`;

const ChatRoomView = React.memo(function ChatRoomView() {
  const { roomId } = useParams<ChatRoomRouteParams>();

  const { setCanInvite } = useAppLayout();

  useEffect(() => {
    setCanInvite(true);
    return () => {
      setCanInvite(false);
    };
  }, [setCanInvite]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((current) => !current);
  }, []);

  const isMobile = useIsMobile();

  return (
    <RoomUsersProvider roomId={roomId}>
      <Prompt when={true} message="Are you sure to leave this conversation?" />
      <Box flex={1} clone>
        <Grid container spacing={2} component={Paper}>
          <Grid item md={3}>
            <RoomUserList roomId={roomId} />
          </Grid>
          <Grid item xs md={9}>
            <Conversation
              roomId={roomId}
              onClickRoomUserCounter={isMobile ? toggleDrawer : undefined}
            />
          </Grid>
        </Grid>
      </Box>
      <OnlyOnMobile>
        <StyledDrawer open={isDrawerOpen}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding={1}
          >
            <Typography variant="h5">
              <Bold>Room Users</Bold>
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <RoomUserList roomId={roomId} />
        </StyledDrawer>
      </OnlyOnMobile>
    </RoomUsersProvider>
  );
});

export default ChatRoomView;
