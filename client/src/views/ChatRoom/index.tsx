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
import IsMobile from 'components/IsMobile';
import { Bold } from 'components/Text';
import { ChatRoomRouteParams } from 'components/Routes';
import { useInviter } from 'contexts/InviterContext';

const DRAWER_WIDTH = '100%';

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: ${DRAWER_WIDTH};
  }
`;

const ChatRoomView = React.memo(function ChatRoomView() {
  const { roomId } = useParams<ChatRoomRouteParams>();

  const { setCanInvite } = useInviter();

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
        <Grid
          container
          spacing={2}
          component={Paper}
          // When we used "noWrap" for the title in "Conversation",
          // it disrupts this layout for mobile view.
          // So, "nowrap" is added here to fix that problem.
          wrap="nowrap"
        >
          <Grid item xs={false} md={3}>
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
      <IsMobile>
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
      </IsMobile>
    </RoomUsersProvider>
  );
});

export default ChatRoomView;
