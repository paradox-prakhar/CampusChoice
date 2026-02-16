import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '@/providers/Web3Provider';
import * as contractService from '@/services/contractService';
import type { OnChainProposal } from '@/services/contractService';

// ── Quai Network Configuration (from old frontend) ──
export const NETWORKS: Record<string, {
  chainId: string;
  chainName: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}> = {
  'quai-cyprus1': {
    chainId: '0x2328', // 9000 decimal
    chainName: 'Quai Network Cyprus-1',
    nativeCurrency: { name: 'QUAI', symbol: 'QUAI', decimals: 18 },
    rpcUrls: ['https://rpc.quai.network/cyprus1'],
    blockExplorerUrls: ['https://quaiscan.io'],
  },
  'quai-orchard': {
    chainId: '0x2329', // 9001 decimal
    chainName: 'Quai Orchard Testnet Cyprus-1',
    nativeCurrency: { name: 'QUAI', symbol: 'QUAI', decimals: 18 },
    rpcUrls: ['https://orchard.rpc.quai.network/cyprus1'],
    blockExplorerUrls: ['https://orchard.quaiscan.io'],
  },
  'sepolia': {
    chainId: '0xaa36a7', // 11155111 decimal
    chainName: 'Sepolia Test Network',
    nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
};

// ── Types ──
interface AppContextType {
  proposals: OnChainProposal[];
  isLoading: boolean;
  fetchProposals: () => Promise<void>;
  submitProposal: (title: string, ipfsCID: string, durationSeconds: number) => Promise<boolean>;
  voteOnProposal: (proposalId: number, support: boolean) => Promise<boolean>;
  finalize: (proposalId: number) => Promise<boolean>;
  hasUserVoted: (proposalId: number) => Promise<boolean>;
  txPending: boolean;
  network: string;
  setNetwork: (network: string) => void;
  switchNetwork: (networkKey: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { account, getSigner } = useWeb3();
  const [proposals, setProposals] = useState<OnChainProposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [network, setNetwork] = useState<string>('quai-cyprus1');

  // ── Switch network on wallet ──
  const switchNetwork = useCallback(async (networkKey: string) => {
    const ethereum = (window as any).ethereum || (window as any).pelagus;
    if (!ethereum) return;
    const net = NETWORKS[networkKey];
    if (!net) return;

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: net.chainId }],
      });
    } catch (switchError: any) {
      // Chain not added — try adding it
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [net],
          });
        } catch (addError) {
          console.error('Failed to add network', addError);
        }
      }
    }
  }, []);

  // ── Fetch proposals ──
  const fetchProposals = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await contractService.getAllProposals();
      setProposals(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error('Failed to fetch proposals:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount + poll every 15s
  useEffect(() => {
    fetchProposals();
    const interval = setInterval(fetchProposals, 15000);
    return () => clearInterval(interval);
  }, [fetchProposals]);

  // ── Create proposal ──
  const submitProposal = useCallback(async (
    title: string,
    ipfsCID: string,
    durationSeconds: number
  ): Promise<boolean> => {
    const signer = await getSigner();
    if (!signer) return false;
    try {
      setTxPending(true);
      await contractService.createProposal(signer, title, ipfsCID, durationSeconds);
      await fetchProposals();
      return true;
    } catch (err: any) {
      console.error('Create proposal failed:', err);
      return false;
    } finally {
      setTxPending(false);
    }
  }, [getSigner, fetchProposals]);

  // ── Vote ──
  const voteOnProposal = useCallback(async (
    proposalId: number,
    support: boolean
  ): Promise<boolean> => {
    const signer = await getSigner();
    if (!signer) return false;
    try {
      setTxPending(true);
      await contractService.vote(signer, proposalId, support);
      await fetchProposals();
      return true;
    } catch (err: any) {
      console.error('Vote failed:', err);
      return false;
    } finally {
      setTxPending(false);
    }
  }, [getSigner, fetchProposals]);

  // ── Finalize ──
  const finalize = useCallback(async (proposalId: number): Promise<boolean> => {
    const signer = await getSigner();
    if (!signer) return false;
    try {
      setTxPending(true);
      await contractService.finalizeProposal(signer, proposalId);
      await fetchProposals();
      return true;
    } catch (err: any) {
      console.error('Finalize failed:', err);
      return false;
    } finally {
      setTxPending(false);
    }
  }, [getSigner, fetchProposals]);

  // ── Check voted ──
  const hasUserVoted = useCallback(async (proposalId: number): Promise<boolean> => {
    if (!account) return false;
    try {
      return await contractService.hasVoted(proposalId, account);
    } catch {
      return false;
    }
  }, [account]);

  return (
    <AppContext.Provider value={{
      proposals,
      isLoading,
      fetchProposals,
      submitProposal,
      voteOnProposal,
      finalize,
      hasUserVoted,
      txPending,
      network,
      setNetwork,
      switchNetwork,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}
