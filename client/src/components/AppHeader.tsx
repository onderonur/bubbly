import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  useTheme,
  Button,
} from '@material-ui/core';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { useSettings } from 'contexts/SettingsContext';
import styled from 'styled-components';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import ShareDialog from './ShareDialog';
import useDialogState from 'views/ChatRoom/hooks/useDialogState';
import Stack from './Stack';
import ShareIcon from '@material-ui/icons/Share';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import IsMobile from './IsMobile';
import AppTitleWithMenuToggler from './AppTitleWithMenuToggler';
import { useAppDrawer } from './AppDrawer/contexts/AppDrawerContext';
import { Route } from 'react-router-dom';
import { routes } from 'utils';

const StyledAppBar = styled(AppBar)`
  /* To clip drawers under the header */
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`;

const AppHeader = React.memo(function AppHeader() {
  const { settings, toggleVolume } = useSettings();
  const { volume } = settings;

  const { toggleTheme } = useSettings();

  const theme = useTheme();

  const isDarkTheme = theme.palette.type === 'dark';

  const { isOpen, openDialog, closeDialog } = useDialogState();

  const { toggleDrawer } = useAppDrawer();

  return (
    <>
      <StyledAppBar position="fixed" color="inherit" variant="outlined">
        <Toolbar>
          <AppTitleWithMenuToggler
            hideTextOnMobile
            asLink
            onClickMenuButton={toggleDrawer}
          />
          <Box flex={1} />
          <Stack spacing={1} alignItems="center">
            <Route path={routes.chatRoom.path()}>
              <IsMobile
                fallback={
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<ShareIcon />}
                    onClick={openDialog}
                  >
                    Invite Friends
                  </Button>
                }
              >
                <IconButton color="primary" onClick={openDialog}>
                  <ShareIcon />
                </IconButton>
              </IsMobile>
              <ShareDialog isOpen={isOpen} onClose={closeDialog} />
            </Route>

            <IconButton
              href="https://twitter.com/onderonur_"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              href="https://github.com/onderonur/bubbly"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton onClick={toggleTheme}>
              {isDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Route path={routes.chatRoom.path()}>
              <IconButton onClick={toggleVolume}>
                {volume ? <VolumeUpIcon /> : <VolumeOffIcon />}
              </IconButton>
            </Route>
          </Stack>
        </Toolbar>
      </StyledAppBar>
    </>
  );
});

export default AppHeader;
