import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Toolbar,
  Divider,
} from '@material-ui/core';
import styled from 'styled-components';
import RouterLink from 'components/RouterLink';
import Loading from 'components/Loading';
import useIsMobile from 'hooks/useIsMobile';
import AppTitleWithMenuToggler from '../AppTitleWithMenuToggler';
import { useLocation } from 'react-router-dom';
import { useAppDrawer } from './contexts/AppDrawerContext';
import { useThemedRooms } from 'contexts/ThemedRoomsContext';
import { routes } from 'utils';

const drawerWidth = '240px';

const StyledDrawer = styled(Drawer)`
  width: ${drawerWidth};
  .MuiDrawer-paper {
    width: ${drawerWidth};
  }
`;

const AppDrawer = React.memo(function AppDrawer() {
  const themedRooms = useThemedRooms();

  const isMobile = useIsMobile();

  const { isOpen, toggleDrawer } = useAppDrawer();

  const location = useLocation();

  return (
    <StyledDrawer
      open={isOpen}
      variant={isMobile ? 'temporary' : 'permanent'}
      onClose={toggleDrawer}
    >
      <Toolbar>
        <AppTitleWithMenuToggler onClickMenuButton={toggleDrawer} />
      </Toolbar>
      <Divider />
      <Loading loading={!themedRooms}>
        <List
          subheader={<ListSubheader disableSticky>Themed Rooms</ListSubheader>}
        >
          {themedRooms?.map((room) => {
            const to = routes.chatRoom.path({ roomId: room.slug });
            return (
              <ListItem
                key={room.slug}
                button
                component={RouterLink}
                to={to}
                selected={location.pathname === to}
              >
                <ListItemText primary={room.title} />
              </ListItem>
            );
          })}
        </List>
      </Loading>
    </StyledDrawer>
  );
});

export default AppDrawer;
