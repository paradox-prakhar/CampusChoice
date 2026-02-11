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
                  // @ts-ignore
                  const pelagus = window.pelagus;
                  // @ts-ignore
                  const ethereum = window.ethereum;

                  console.log('Pelagus Wallet Check:', { pelagus: !!pelagus, ethereum: !!ethereum });

                  let provider = undefined;

                  if (pelagus) {
                      console.log('Pelagus provider found directly.');
                      provider = pelagus;
                  } else if (ethereum?.isPelagus) {
                      console.log('Pelagus found as window.ethereum (isPelagus=true).');
                      provider = ethereum;
                  } else if (ethereum) {
                      console.log('Returning window.ethereum as fallback.');
                      provider = ethereum;
                  }

                  if (provider) {
                      // Proxy the provider to intercept request calls
                      return new Proxy(provider, {
                          get(target, prop, receiver) {
                              if (prop === 'request') {
                                  return async (args: any) => {
                                      // Intercept eth_requestAccounts and swap with quai_requestAccounts
                                      if (args.method === 'eth_requestAccounts') {
                                          console.log('Intercepting eth_requestAccounts -> quai_requestAccounts');
                                          try {
                                              return await target.request({ ...args, method: 'quai_requestAccounts' });
                                          } catch (err) {
                                              console.error('Error in quai_requestAccounts:', err);
                                              throw err;
                                          }
                                      }
                                      return target.request(args);
                                  };
                              }
                              return Reflect.get(target, prop, receiver);
                          }
                      });
                  }
              }
              return undefined;
          }
      })(config),
      ...walletDetails,
    }));
  },
});

