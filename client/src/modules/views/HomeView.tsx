import React, { useCallback, useState } from 'react';
import {
  Box,
  fade,
  Grid,
  Typography,
  Paper,
  useTheme,
} from '@material-ui/core';
import useSocketIo from 'modules/socket-io/SocketIoContext';
import { ID } from 'modules/shared/SharedTypes';
import { useHistory } from 'react-router-dom';
import { useSnack } from 'modules/snackbar/BaseSnackbarContext';
import ChatLogo from 'modules/shared/ChatLogo';
import styled from 'styled-components';
import AbsoluteFill from 'modules/shared/AbsoluteFill';
import { Bold } from 'modules/shared/Text';
import AppLogo from 'modules/app-logo/AppLogo';
import useIsMobile from 'modules/is-mobile/useIsMobile';
import { routes } from 'modules/routing/RoutingConstants';
import BaseButton from 'modules/shared/BaseButton';

interface StyledAppLogoProps {
  $isMobile: boolean;
}

const StyledAppLogo = styled(AppLogo)<StyledAppLogoProps>`
  object-fit: contain;
  width: 100%;
  height: ${({ $isMobile }) => ($isMobile ? 120 : 200)}px;
`;

const HomeView = React.memo(function Home() {
  const socket = useSocketIo();
  const history = useHistory();
  const { success } = useSnack();

  const [loading, setLoading] = useState(false);

  const createRoom = useCallback(() => {
    setLoading(true);
    socket?.emit('create room', (roomId: ID) => {
      setLoading(false);
      success('Welcome to your chat room!');
      history.push(routes.rooms.routes.chatRoom.path({ roomId }));
    });
  }, [history, socket, success]);

  const theme = useTheme();

  const isMobile = useIsMobile();

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <Box width="100%" height={600} padding={3} clone>
        <Paper>
          <ChatLogo />
        </Paper>
      </Box>
      <AbsoluteFill display="flex" alignItems="center">
        <Grid container justify="center">
          <Box
            bgcolor={fade(theme.palette.secondary.main, 0.4)}
            height="auto"
            padding={2}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            border="2px solid #fff"
            clone
          >
            <Grid item xs={10} md={8} lg={6}>
              <Grid container direction="row" alignItems="center">
                <Grid item xs={12} sm={5}>
                  <Box padding={2}>
                    <StyledAppLogo quality="large" $isMobile={isMobile} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Typography variant="h2" gutterBottom>
                      <Bold>{process.env.REACT_APP_TITLE}</Bold>
                    </Typography>
                    <BaseButton
                      variant="contained"
                      color="primary"
                      loading={loading}
                      onClick={createRoom}
                    >
                      Create Room
                    </BaseButton>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </AbsoluteFill>
    </Box>
  );
});

export default HomeView;
