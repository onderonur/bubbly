import React from 'react';
import { Route } from 'react-router-dom';
import HomeView from './Home';
import { routes } from 'utils';
import RoomsRoutes from './Rooms';
import BaseRouterSwitch from 'components/BaseRouterSwitch';

export interface ChatRoomRouteParams {
  roomId: string;
}

const Routes = React.memo(function Routes() {
  return (
    <BaseRouterSwitch>
      <Route path={routes.rooms.path()}>
        <RoomsRoutes />
      </Route>
      <Route exact path={routes.home.path()}>
        <HomeView />
      </Route>
    </BaseRouterSwitch>
  );
});

export default Routes;
