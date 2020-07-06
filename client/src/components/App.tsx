import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketIoProvider } from '../contexts/SocketContext';
import Routes from './Routes';
import AppLayout from './AppLayout';
import ViewerProvider from 'contexts/ViewerContext';
import SettingsProvider from 'contexts/SettingsContext';
import BaseThemeProvider from '../contexts/BaseThemeContext';
import BaseSnackbarProvider from 'contexts/BaseSnackbarContext';
import ThemedRoomsProvider from 'contexts/ThemedRoomsContext';

const App = React.memo(function App() {
  return (
    <SettingsProvider>
      <BaseThemeProvider>
        <BaseSnackbarProvider>
          <SocketIoProvider>
            <ViewerProvider>
              <ThemedRoomsProvider>
                <Router>
                  <AppLayout>
                    <Routes />
                  </AppLayout>
                </Router>
              </ThemedRoomsProvider>
            </ViewerProvider>
          </SocketIoProvider>
        </BaseSnackbarProvider>
      </BaseThemeProvider>
    </SettingsProvider>
  );
});

export default App;
