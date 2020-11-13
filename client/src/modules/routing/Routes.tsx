import React from 'react';
import { Route } from 'react-router-dom';
import HomeView from 'modules/views/HomeView';
import { routes } from './RoutingConstants';
import BaseRouterSwitch from 'modules/routing/BaseRouterSwitch';
import ChatRoomView from 'modules/views/ChatRoomView';

export interface ChatRoomRouteParams {
  roomId: string;
}

const Routes = React.memo(function Routes() {
  return (
    <BaseRouterSwitch>
      <Route path={routes.rooms.path()}>
        <BaseRouterSwitch>
          <Route path={routes.rooms.routes.chatRoom.path()}>
            <ChatRoomView />
          </Route>
        </BaseRouterSwitch>
      </Route>
      <Route exact path={routes.home.path()}>
        <HomeView />
      </Route>
    </BaseRouterSwitch>
  );
});

export default Routes;
