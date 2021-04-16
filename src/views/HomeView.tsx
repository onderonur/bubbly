import React, { useCallback, useState } from 'react';
import {
  Box,
  fade,
  Grid,
  Typography,
  Paper,
  useTheme,
} from '@material-ui/core';
import { useSocketIo } from '@src/modules/socket-io/SocketIoContext';
import { ID } from '@shared/SharedTypes';
import ChatLogo from '@src/modules/shared/ChatLogo';
import styled from 'styled-components';
import AbsoluteFill from '@src/modules/shared/AbsoluteFill';
import { Bold } from '@src/modules/shared/Text';
import AppLogo from '@src/modules/app-logo/AppLogo';
import useIsMobile from '@src/modules/is-mobile/useIsMobile';
import { useRouter } from 'next/router';
import { routes } from '@src/modules/routing/RoutingConstants';
import BaseButton from '@src/modules/shared/BaseButton';
import { RoomsEvent } from '@shared/SocketIoEvents';
import BaseSeo from '@src/modules/seo/BaseSeo';

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
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const createRoom = useCallback(() => {
    setLoading(true);
    socket.emit(RoomsEvent.CREATE_ROOM, (roomId: ID) => {
      setLoading(false);
      router.push(routes.rooms.routes.chatRoom.path({ roomId }));
    });
  }, [socket]);

  const theme = useTheme();

  const isMobile = useIsMobile();

  return (
    <>
      <BaseSeo title="Home" />
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
                        <Bold>{process.env.NEXT_PUBLIC_APP_TITLE}</Bold>
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
    </>
  );
});

export default HomeView;
