import React from 'react';
import {
  CssBaseline,
  MuiThemeProvider,
  StylesProvider,
} from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import getTheme from '@src/modules/theme/theme';
import { useSettings } from '../settings/SettingsContext';
import Head from 'next/head';

type BaseThemeProviderProps = React.PropsWithChildren<{}>;

function BaseThemeProvider({ children }: BaseThemeProviderProps) {
  const { settings } = useSettings();

  const theme = getTheme(settings.themeType);

  return (
    <>
      <Head>
        {/* PWA primary color */}
        <meta name="theme-color" content={theme.palette.background.paper} />
        {/* Import CSS for nprogress */}
        <link rel="stylesheet" type="text/css" href="/nprogress.css" />
      </Head>
      <StylesProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </MuiThemeProvider>
      </StylesProvider>
    </>
  );
}

export default BaseThemeProvider;
