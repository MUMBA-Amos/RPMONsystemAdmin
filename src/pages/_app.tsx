/* eslint-disable @next/next/no-page-custom-font */
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApProvider from '../Provider';
import '../styles/globals.css';
import { ConfigProvider } from 'antd';
import { useMasterState } from '@/modules/master/context';
import { useEffect } from 'react';

function MyAppX({ Component, pageProps: { ...pageProps } }: AppProps) {
  const { fetchMaster } = useMasterState();

  useEffect(() => {
    fetchMaster();
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>

      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Script
        id="stripe-js"
        src="/assets/js/script.js"
        onLoad={() => {
          console.log('script loaded');
        }}
        onError={(e) => {
          console.error('Script failed to load', e);
        }}
      />
    </>
  );
}

function MyApp({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '',
          colorPrimary: '#DAA520'
        }
      }}
    >
      <SessionProvider session={session} refetchInterval={60 * 60}>
        <ApProvider>
          <MyAppX pageProps={pageProps} Component={Component} router={router} />
        </ApProvider>
      </SessionProvider>
    </ConfigProvider>
  );
}

export default MyApp;
