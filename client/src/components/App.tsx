import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketIoProvider } from '../contexts/SocketIoContext';
import Routes from '../views';
import AppLayout from './AppLayout';
import ViewerProvider from 'contexts/ViewerContext';
import SettingsProvider from 'contexts/SettingsContext';
import BaseThemeProvider from '../contexts/BaseThemeContext';
import BaseSnackbarProvider from 'contexts/BaseSnackbarContext';
import TopicsProvider from 'contexts/TopicsContext';

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
