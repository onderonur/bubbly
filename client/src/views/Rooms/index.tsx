import React from 'react';
import { Route } from 'react-router-dom';
import { routes } from 'utils';
import ChatRoomView from './views/ChatRoom';
import BaseRouterSwitch from 'components/BaseRouterSwitch';

export interface ChatRoomRouteParams {
  roomId: string;
}

const RoomsRoutes = React.memo(function RoomsRoutes() {
  return (
    <BaseRouterSwitch>
      <Route path={routes.rooms.routes.chatRoom.path()}>
        <ChatRoomView />
      </Route>
    </BaseRouterSwitch>
  );
});

export default RoomsRoutes;
