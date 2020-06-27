import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketIoProvider } from '../contexts/SocketContext';
import Routes from './Routes';
import AppLayout from './AppLayout';
import ViewerProvider from 'contexts/ViewerContext';
import SettingsProvider from 'contexts/SettingsContext';
import BaseThemeProvider from '../contexts/BaseThemeContext';
import BaseSnackbarProvider from 'contexts/BaseSnackbarContext';

const App = React.memo(function App() {
  return (
    <SettingsProvider>
      <BaseThemeProvider>
        <BaseSnackbarProvider>
          <SocketIoProvider>
            <ViewerProvider>
              <Router>
                <AppLayout>
                  <Routes />
                </AppLayout>
              </Router>
            </ViewerProvider>
          </SocketIoProvider>
        </BaseSnackbarProvider>
      </BaseThemeProvider>
    </SettingsProvider>
  );
});

export default App;
