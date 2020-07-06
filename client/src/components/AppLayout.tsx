import React from 'react';
import { Container } from '@material-ui/core';
import AppHeader from './AppHeader';
import styled from 'styled-components';
import ToolbarOffset from './ToolbarOffset';
import AppDrawer, { AppDrawerProvider } from './AppDrawer';
import InviterProvider from 'contexts/InviterContext';

const Root = styled.div`
  display: flex;
  min-height: 100vh;
  max-height: 100vh;
`;

const Content = styled.main`
  padding: ${({ theme }) => theme.spacing(2)}px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

type AppLayoutProps = React.PropsWithChildren<{}>;

function AppLayout({ children }: AppLayoutProps) {
  return (
    <InviterProvider>
      <AppDrawerProvider>
        <Root>
          <AppHeader />
          <AppDrawer />
          <Container component={Content} maxWidth="lg">
            <ToolbarOffset />
            <>{children}</>
          </Container>
        </Root>
      </AppDrawerProvider>
    </InviterProvider>
  );
}

export default AppLayout;
