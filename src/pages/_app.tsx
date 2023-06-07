import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from 'styles/theme';
import createEmotionCache from 'createEmoticonCache';
import Layout from 'components/layouts/Layout';
import { SnackbarProvider } from 'notistack';
import { GoalProvider } from 'components/context/GoalProvider';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
import 'bootstrap/dist/css/bootstrap.min.css';

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <script
          src="https://kit.fontawesome.com/d4c536fd94.js"
          crossOrigin="anonymous"
          async
        />
        <title>2/cent - Explore patterns to foster productivity!</title>
        <meta property="og:title" content="2/cent" key="title" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      </Head>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <GoalProvider>
            <Layout>
              <CssBaseline />
              <Component {...pageProps} />
            </Layout>
          </GoalProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
