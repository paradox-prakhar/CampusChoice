import { getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { quaiCyprus1, quaiOrchard } from './chains';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import { pelagusWallet } from './pelagus';

const appName = 'CampusChoice';
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

const { wallets } = getDefaultWallets({
  appName,
  projectId,
});

export const config = getDefaultConfig({
  appName,
  projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base, quaiCyprus1, quaiOrchard],
  ssr: true, // If your dApp uses server side rendering (SSR)
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [pelagusWallet],
    },
  ],
});
