import { Wallet } from '@rainbow-me/rainbowkit';
import { injected } from 'wagmi/connectors';
import { createConnector } from 'wagmi';

// eslint-disable-next-line no-empty-pattern
export const pelagusWallet = ({}: any = {}): Wallet => ({
  id: 'pelagus',
  name: 'Pelagus',
  iconUrl: 'https://raw.githubusercontent.com/pelaguswallet/pelagus-extension/develop/src/assets/logo.svg',
  iconBackground: '#002E5D',
  downloadUrls: {
    chrome: 'https://chrome.google.com/webstore/detail/pelagus/eefobaoxmnpacfvdlkjanapcnaqhgnfa',
    browserExtension: 'https://pelaguswallet.io',
  },
  createConnector: (walletDetails) => {
    return createConnector((config) => ({
      ...injected({
          target: () => {
              if (typeof window !== 'undefined') {
                  // Prioritize window.pelagus if available for correct detection
                  // @ts-ignore
                  console.log('Checking for Pelagus:', window.pelagus);
                  // @ts-ignore
                  if (window.pelagus) {
                      console.log('Pelagus found!');
                      // @ts-ignore
                      return window.pelagus;
                  }
                  // Fallback to window.ethereum if pelagus specific object is not found (though less likely to work for specific features)
                  // @ts-ignore
                  console.log('Pelagus not found, falling back to window.ethereum:', window.ethereum);
                  // @ts-ignore
                  return window.ethereum;
              }
              return undefined;
          }
      })(config),
      ...walletDetails,
    }));
  },
});

