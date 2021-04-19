import AppLayout from '@src/modules/layout/AppLayout';
import SettingsProvider, {
  SettingsOptions,
} from '@src/modules/settings/SettingsContext';
import BaseSnackbarProvider from '@src/modules/snackbar/BaseSnackbarContext';
import SocketIoProvider from '@src/modules/socket-io/SocketIoContext';
import BaseThemeProvider from '@src/modules/theme/BaseThemeContext';
import TopicsProvider, { fetchTopics } from '@src/modules/topics/TopicsContext';
import ViewerProvider from '@src/modules/viewer/ViewerContext';
import App, { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { Maybe, Topic } from '@shared/SharedTypes';
import { getSettingsFromCookie } from '@src/modules/settings/SettingsUtils';
import NProgress from 'nprogress';
import { Router } from 'next/router';
import BaseDefaultSeo from '@src/modules/seo/BaseDefaultSeo';

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

type MyAppProps = AppProps & {
  settings: Maybe<SettingsOptions>;
  topics: Topic[];
};

function MyApp({ Component, pageProps, settings, topics }: MyAppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        {/* Import CSS for nprogress */}
        <link rel="stylesheet" type="text/css" href="/nprogress.css" />
      </Head>
      <BaseDefaultSeo />
      <SettingsProvider initialSettings={settings}>
        <BaseThemeProvider>
          <BaseSnackbarProvider>
            <SocketIoProvider>
              <TopicsProvider initialData={topics}>
                <ViewerProvider>
                  <AppLayout>
                    <Component {...pageProps} />
                  </AppLayout>
                </ViewerProvider>
              </TopicsProvider>
            </SocketIoProvider>
          </BaseSnackbarProvider>
        </BaseThemeProvider>
      </SettingsProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const settings = getSettingsFromCookie(appContext.ctx);
  const topics = await fetchTopics();
  return { ...appProps, settings, topics };
};

export default MyApp;
