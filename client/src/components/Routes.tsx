import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomeView from '../views/Home';
import ChatRoomView from '../views/ChatRoom';
import { routes } from 'utils';

export interface ChatRoomRouteParams {
  roomId: string;
}

const Routes = React.memo(function Routes() {
  return (
    <Switch>
      <Route exact path={routes.chatRoom.path()}>
        <ChatRoomView />
      </Route>
      <Route path={routes.home.path()}>
        <HomeView />
      </Route>
    </Switch>
  );
});

export default Routes;
