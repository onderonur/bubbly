import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from 'react';
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
import AppTitleWithMenuButton from './AppTitleWithMenuButton';
import { useLocation } from 'react-router-dom';

interface AppDrawerContextValue {
  isOpen: boolean;
  toggleDrawer: VoidFunction;
}

const AppDrawerContext = React.createContext<AppDrawerContextValue>(
  {} as AppDrawerContextValue
);

export function useAppDrawer() {
  const value = useContext(AppDrawerContext);
  return value;
}

type AppDrawerProviderProps = React.PropsWithChildren<{}>;

export function AppDrawerProvider({ children }: AppDrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleDrawer = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  const contextValue = useMemo<AppDrawerContextValue>(() => {
    return { isOpen, toggleDrawer };
  }, [isOpen, toggleDrawer]);

  return (
    <AppDrawerContext.Provider value={contextValue}>
      {children}
    </AppDrawerContext.Provider>
  );
}

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
        <AppTitleWithMenuButton onClickMenuButton={toggleDrawer} />
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
