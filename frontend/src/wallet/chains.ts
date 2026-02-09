import { Chain } from 'wagmi/chains';

export const quaiCyprus1 = {
  id: 9000,
  name: 'Quai Network Cyprus-1',
  nativeCurrency: { name: 'Quai', symbol: 'QUAI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.quai.network/cyprus1'] },
  },
  blockExplorers: {
    default: { name: 'QuaiScan', url: 'https://quaiscan.io' },
  },
} as const satisfies Chain;

export const quaiOrchard = {
  id: 15000,
  name: 'Quai Orchard Testnet Cyprus-1',
  nativeCurrency: { name: 'Quai', symbol: 'QUAI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://orchard.rpc.quai.network/cyprus1'] },
  },
  blockExplorers: {
    default: { name: 'QuaiScan', url: 'https://orchard.quaiscan.io' },
  },
  testnet: true,
} as const satisfies Chain;
