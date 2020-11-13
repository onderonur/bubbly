import React from 'react';
import { Container, useTheme } from '@material-ui/core';
import AppHeader from './AppHeader';
import styled from 'styled-components';
import ToolbarOffset from 'modules/layout/ToolbarOffset';
import AppDrawer from './AppDrawer';
import AppDrawerProvider from './AppDrawerContext';
import { Helmet } from 'react-helmet';

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
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <meta name="theme-color" content={theme.palette.background.paper} />
      </Helmet>
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
    </>
  );
}

export default AppLayout;
