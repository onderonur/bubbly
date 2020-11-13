import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Chat from 'modules/chat/Chat';
import RoomUserList from 'modules/room-users/RoomUserList';
import {
  Grid,
  Box,
  Paper,
  Drawer,
  IconButton,
  Divider,
  Typography,
} from '@material-ui/core';
import RoomUsersProvider from 'modules/room-users/RoomUsersContext';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import useIsMobile from 'modules/is-mobile/useIsMobile';
import IsMobile from 'modules/is-mobile/IsMobile';
import { ChatRoomRouteParams } from 'modules/routing/Routes';
import useChatRoom from 'modules/chat/useChatRoom';
import ChatMessageProvider from 'modules/chat/ChatMessageContext';

const drawerWidth = '100%';

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: ${drawerWidth};
  }
`;

const ChatRoomContent = React.memo(function ChatRoomContent() {
  const { roomId } = useParams<ChatRoomRouteParams>();

  useChatRoom(roomId);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((current) => !current);
  }, []);

  const isMobile = useIsMobile();

  return (
    <>
      <Box flex={1} clone>
        <Grid
          container
          spacing={2}
          component={Paper}
          // When we used "noWrap" for the title in "Chat",
          // it disrupts this layout for mobile view.
          // So, "nowrap" is added here to fix that problem.
          wrap="nowrap"
        >
          <Grid item xs={false} md={3}>
            <RoomUserList />
          </Grid>
          <Grid item xs md={9}>
            <Chat
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
            <Typography variant="h5">Room Users</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <RoomUserList />
        </StyledDrawer>
      </IsMobile>
    </>
  );
});

const ChatRoomView = React.memo(function ChatRoomView() {
  const { roomId } = useParams<ChatRoomRouteParams>();

  return (
    <RoomUsersProvider roomId={roomId}>
      <ChatMessageProvider roomId={roomId}>
        <ChatRoomContent />
      </ChatMessageProvider>
    </RoomUsersProvider>
  );
});

export default ChatRoomView;
