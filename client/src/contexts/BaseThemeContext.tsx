import React from 'react';
import {
  CssBaseline,
  MuiThemeProvider,
  StylesProvider,
} from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import getTheme from 'theme';
import { useSettings } from './SettingsContext';

type BaseThemeProviderProps = React.PropsWithChildren<{}>;

function BaseThemeProvider({ children }: BaseThemeProviderProps) {
  const { settings } = useSettings();

  const theme = getTheme(settings.themeType);

  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
}

export default BaseThemeProvider;
