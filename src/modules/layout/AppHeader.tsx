import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  useTheme,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { useSettings } from '@src/modules/settings/SettingsContext';
import styled from 'styled-components';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import ShareDialog from '@src/modules/social-share/ShareDialog';
import Stack from '../shared/Stack';
import ShareIcon from '@material-ui/icons/Share';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import IsMobile from '@src/modules/is-mobile/IsMobile';
import AppTitleWithMenuToggler from './AppTitleWithMenuToggler';
import { useAppDrawer } from './AppDrawerContext';
import BaseButton from '../shared/BaseButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BaseMenu, {
  BaseMenuTrigger,
  BaseMenuList,
  BaseMenuItem,
} from '@src/modules/shared/BaseMenu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useViewer } from '@src/modules/viewer/ViewerContext';
import { useDialogState } from '@src/modules/base-dialog/BaseDialogHooks';
import { useRouter } from 'next/router';
import { routes } from '../routing/RoutingConstants';

const StyledAppBar = styled(AppBar)`
  /* To clip drawers under the header */
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`;

const AppHeader = React.memo(function AppHeader() {
  const { settings, toggleIsSoundOn } = useSettings();
  const { isSoundOn } = settings;

  const { toggleTheme } = useSettings();

  const theme = useTheme();

  const isDarkTheme = theme.palette.type === 'dark';

  const { isOpen, openDialog, closeDialog } = useDialogState();

  const { toggleDrawer } = useAppDrawer();

  const { startEditing } = useViewer();

  const router = useRouter();
  const { pathname } = router;

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
            {pathname === routes.rooms.routes.chatRoom.path() && (
              <>
                <IsMobile
                  fallback={
                    <BaseButton
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<ShareIcon />}
                      onClick={openDialog}
                    >
                      Invite Friends
                    </BaseButton>
                  }
                >
                  <IconButton color="primary" onClick={openDialog}>
                    <ShareIcon />
                  </IconButton>
                </IsMobile>
                <ShareDialog isOpen={isOpen} onClose={closeDialog} />
              </>
            )}

            <IconButton onClick={toggleTheme}>
              {isDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            <BaseMenu>
              <BaseMenuTrigger>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </BaseMenuTrigger>
              <BaseMenuList>
                {pathname === routes.rooms.routes.chatRoom.path() && (
                  <BaseMenuItem onClick={toggleIsSoundOn}>
                    <ListItemIcon>
                      {isSoundOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Sound: ${isSoundOn ? 'On' : 'Off'}`}
                    />
                  </BaseMenuItem>
                )}
                <BaseMenuItem onClick={startEditing}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </BaseMenuItem>
                <BaseMenuItem
                  component="a"
                  href="https://twitter.com/onderonur"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <TwitterIcon />
                  </ListItemIcon>
                  <ListItemText primary="Twitter" />
                </BaseMenuItem>
                <MenuItem
                  component="a"
                  href="https://github.com/onderonur/bubbly"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <GitHubIcon />
                  </ListItemIcon>
                  <ListItemText primary="GitHub" />
                </MenuItem>
              </BaseMenuList>
            </BaseMenu>
          </Stack>
        </Toolbar>
      </StyledAppBar>
    </>
  );
});

export default AppHeader;
