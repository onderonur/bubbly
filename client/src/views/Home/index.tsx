import React, { useCallback } from 'react';
import {
  Button,
  Box,
  fade,
  Grid,
  Typography,
  Paper,
  useTheme,
} from '@material-ui/core';
import useSocketIo from '../../contexts/SocketContext';
import { ID } from 'types';
import { useHistory } from 'react-router-dom';
import { useSnack } from 'contexts/BaseSnackbarContext';
import ChatLogo from './components/ChatLogo';
import styled from 'styled-components';
import AbsoluteFill from 'components/AbsoluteFill';
import { Bold } from 'components/Text';
import AppLogo from 'components/AppLogo';
import useIsMobile from 'hooks/useIsMobile';

interface StyledAppLogoProps {
  $isMobile: boolean;
}

const StyledAppLogo = styled(AppLogo)<StyledAppLogoProps>`
  object-fit: contain;
  width: 100%;
  height: ${({ $isMobile }) => ($isMobile ? 120 : 200)}px;
`;

const HomeView = React.memo(function Home() {
  const io = useSocketIo();
  const history = useHistory();
  const { success } = useSnack();

  const createRoom = useCallback(() => {
    io?.emit('create room', (roomId: ID) => {
      success('Welcome to your chat room!');
      history.push(`/${roomId}`);
    });
  }, [history, io, success]);

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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={createRoom}
                    >
                      Create Room
                    </Button>
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
