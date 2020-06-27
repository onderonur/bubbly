import React, { useState, useMemo, useContext } from 'react';
import { Container } from '@material-ui/core';
import AppHeader from './AppHeader';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ToolbarOffset = styled.div(({ theme }) => theme.mixins.toolbar as any);

const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh;
`;

const Content = styled.main`
  padding: ${({ theme }) => theme.spacing(2)}px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

interface AppLayoutContextValue {
  canInvite: boolean;
  setCanInvite: (canInvite: boolean) => void;
}

const AppLayoutContext = React.createContext<AppLayoutContextValue>(
  {} as AppLayoutContextValue
);

export function useAppLayout() {
  const value = useContext(AppLayoutContext);
  return value;
}

type AppLayoutProps = React.PropsWithChildren<{}>;

function AppLayout({ children }: AppLayoutProps) {
  const [canInvite, setCanInvite] = useState(false);

  const contextValue = useMemo<AppLayoutContextValue>(
    () => ({ canInvite, setCanInvite }),
    [canInvite]
  );

  return (
    <AppLayoutContext.Provider value={contextValue}>
      <Root>
        <AppHeader />
        <ToolbarOffset />
        <Container component={Content} maxWidth="lg">
          <>{children}</>
        </Container>
      </Root>
    </AppLayoutContext.Provider>
  );
}

export default AppLayout;
