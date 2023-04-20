import { useState } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
  AppShell,
  Group,
  Header,
  Text,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimateKeyframes } from 'react-simple-animate';
import './_app.css';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import ShoppingCart from '../components/ShoppingCart';
import CookieBanner from '../components/CookieBanner';
import Foot from '../components/Foot';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <>
      <Head>
        <title>Toy Haven</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width user-scalable=0"
        />
        <link rel="shortcut icon" href="/balloons.svg" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme, loader: 'dots' }} withGlobalStyles withNormalizeCSS>
          <Provider store={store}>
            <CookieBanner />
            <AppShell
              m={0}
              p={0}
              footer={<Foot />}
              header={
                <Header height={{ base: 50, md: 70 }} p={0}>
                  <AnimateKeyframes
                    play
                    duration={5}
                    delay={0}
                    iterationCount="infinite"
                    direction="alternate"
                    keyframes={[
                      'background-color: #264653;',
                      'background-color: #2a9d8f',
                      'background-color: #e9c46a',
                      'background-color: #f4a261',
                      'background-color: #e76f51',
                    ]}
                    easeType="cubic-bezier(0.445, 0.05, 0.55, 0.95)"
                  >
                    <Group position="center" mih={70} className="logo" style={{ height: '100%' }}>
                      <motion.div animate={{ scale: [0.1, 1] }} transition={{ duration: 0.2 }}>
                        <Link href="/" passHref>
                          <Text size={45} ff="VT323">
                            {/* <Image
            height={50}
            fit="contain"
            src="../images/logo/logo.png"
            ></Image> */}
                            TOY HAVEN
                          </Text>
                        </Link>
                      </motion.div>
                    </Group>

                    <ShoppingCart />
                  </AnimateKeyframes>
                </Header>
              }
            >
              <Component {...pageProps} />
            </AppShell>
          </Provider>
          <Notifications />
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'light',
  };
};
