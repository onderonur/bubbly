import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomeView from '../views/Home';
import ChatRoomView from '../views/ChatRoom';

export interface ChatRoomRouteParams {
  roomId: string;
}

const Routes = React.memo(function Routes() {
  return (
    <Switch>
      <Route exact path="/:roomId">
        <ChatRoomView />
      </Route>
      <Route path="/">
        <HomeView />
      </Route>
    </Switch>
  );
});

export default Routes;
