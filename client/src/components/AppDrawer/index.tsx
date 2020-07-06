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
import useSwr from 'swr';
import RouterLink from 'components/RouterLink';
import Loading from 'components/Loading';
import useIsMobile from 'hooks/useIsMobile';
import AppTitleWithMenuToggler from '../AppTitleWithMenuToggler';
import { useLocation } from 'react-router-dom';
import { useAppDrawer } from './contexts/AppDrawerContext';

interface ThemedRoom {
  title: string;
  slug: string;
}

const fetcher = (url: string) => fetch(url).then((response) => response.json());

const DRAWER_WIDTH = '240px';

const StyledDrawer = styled(Drawer)`
  width: ${DRAWER_WIDTH};
  .MuiDrawer-paper {
    width: ${DRAWER_WIDTH};
  }
`;

const AppDrawer = React.memo(function AppDrawer() {
  const { data } = useSwr<ThemedRoom[]>('/api/rooms/themed', fetcher);

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
      <Loading loading={!data}>
        <List
          subheader={<ListSubheader disableSticky>Themed Rooms</ListSubheader>}
        >
          {data?.map((room) => {
            const to = `/${room.slug}`;
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
