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
import Loading from '@src/modules/shared/Loading';
import useIsMobile from '@src/modules/is-mobile/useIsMobile';
import AppTitleWithMenuToggler from './AppTitleWithMenuToggler';
import { useAppDrawer } from './AppDrawerContext';
import { useTopics } from '@src/modules/topics/TopicsContext';
import { routes } from '@src/modules/routing/RoutingConstants';
import { useRouter } from 'next/router';
import NextLink from '../routing/NextLink';

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

  const router = useRouter();

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
            const href = routes.rooms.routes.chatRoom.path({
              roomId: topic.roomId,
            });
            return (
              <ListItem
                key={topic.roomId}
                button
                component={NextLink}
                href={href}
                selected={router.pathname === href}
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
