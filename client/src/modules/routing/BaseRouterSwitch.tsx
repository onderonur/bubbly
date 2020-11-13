import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound404 from './NotFound404';

type BaseRouterSwitchProps = React.PropsWithChildren<{}>;

function BaseRouterSwitch({ children }: BaseRouterSwitchProps) {
  return (
    <Switch>
      {children}
      <Route path="*">
        <NotFound404 />
      </Route>
    </Switch>
  );
}

export default BaseRouterSwitch;
