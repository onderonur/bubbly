import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketIoProvider } from '../socket-io/SocketIoContext';
import Routes from '../routing/Routes';
import ViewerProvider from 'modules/viewer/ViewerContext';
import SettingsProvider from 'modules/settings/SettingsContext';
import BaseThemeProvider from '../theme/BaseThemeContext';
import BaseSnackbarProvider from 'modules/snackbar/BaseSnackbarContext';
import TopicsProvider from 'modules/topics/TopicsContext';
import AppLayout from 'modules/layout/AppLayout';

const App = React.memo(function App() {
  return (
    <SettingsProvider>
      <BaseThemeProvider>
        <BaseSnackbarProvider>
          <SocketIoProvider>
            <TopicsProvider>
              <Router>
                <ViewerProvider>
                  <AppLayout>
                    <Routes />
                  </AppLayout>
                </ViewerProvider>
              </Router>
            </TopicsProvider>
          </SocketIoProvider>
        </BaseSnackbarProvider>
      </BaseThemeProvider>
    </SettingsProvider>
  );
});

export default App;
