import './global.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  wallet, darkTheme ,
} from '@rainbow-me/rainbowkit';
import { chain, createClient, configureChains, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.kovan, chain.optimismKovan], 
  [
    alchemyProvider({ alchemyId: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC' }),
    publicProvider(),
  ]
);



const { wallets } = getDefaultWallets({
  appName: 'OptyTools',
  chains,
});

const demoAppInfo = {
  appName: 'RainbowKit',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [wallet.argent({ chains }), wallet.trust({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains} theme={darkTheme({ accentColor: '#5E5CDE' })}>
        <Component {...pageProps} />  
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
