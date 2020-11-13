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
import RouterLink from 'modules/routing/RouterLink';
import Loading from 'modules/shared/Loading';
import useIsMobile from 'modules/is-mobile/useIsMobile';
import AppTitleWithMenuToggler from './AppTitleWithMenuToggler';
import { useLocation } from 'react-router-dom';
import { useAppDrawer } from './AppDrawerContext';
import { useTopics } from 'modules/topics/TopicsContext';
import { routes } from 'modules/routing/RoutingConstants';

const drawerWidth = '240px';

const StyledDrawer = styled(Drawer)`
  width: ${drawerWidth};
  .MuiDrawer-paper {
    width: ${drawerWidth};
  }
`;

const AppDrawer = React.memo(function AppDrawer() {
  const topics = useTopics();

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
      <Loading loading={!topics}>
        <List subheader={<ListSubheader disableSticky>Topics</ListSubheader>}>
          {topics?.map((topic) => {
            const to = routes.rooms.routes.chatRoom.path({
              roomId: topic.roomId,
            });
            return (
              <ListItem
                key={topic.roomId}
                button
                component={RouterLink}
                to={to}
                selected={location.pathname === to}
              >
                <ListItemText primary={topic.title} />
              </ListItem>
            );
          })}
        </List>
      </Loading>
    </StyledDrawer>
  );
});

export default AppDrawer;
