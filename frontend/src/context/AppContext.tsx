import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Proposal, User } from '../types';
import { api } from '../services/api';
import { ethers } from 'ethers';

interface AppContextType {
  user: User | null;
  proposals: Proposal[];
  isLoading: boolean;
  connectWallet: (intendedRole?: string, manualAddress?: string) => Promise<void>;
  disconnectWallet: () => void;
  createProposal: (data: { title: string, description: string, tags: string[], amount: string, recipient: string, duration: number, voting_model: string, venue?: string, host?: string }) => Promise<void>;
  voteOnProposal: (id: string) => Promise<void>;
  notifications: any[]; // Keep mock for UI consistency if needed
  votingTimeRemaining: number;
  executionStatus: 'PENDING' | 'EXECUTED';
  executeProposals: () => void;
  winner: Proposal | null;
  network: string;
  setNetwork: (network: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Voting Timer State
  const [votingTimeRemaining, setVotingTimeRemaining] = useState(120); // 2 minutes
  const [executionStatus, setExecutionStatus] = useState<'PENDING' | 'EXECUTED'>('PENDING');
  const [winner, setWinner] = useState<Proposal | null>(null);
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [network, setNetwork] = useState<string>('quai-cyprus1');

  const NETWORKS: Record<string, any> = {
    'quai-cyprus1': {
      chainId: '0x9', // 9 decimal
      chainName: 'Quai Network Cyprus-1',
      nativeCurrency: { name: 'QUAI', symbol: 'QUAI', decimals: 18 },
      rpcUrls: ['https://rpc.quai.network/cyprus1'],
      blockExplorerUrls: ['https://quaiscan.io'],
    },
    'quai-orchard': {
      chainId: '0x3a98', // 15000 decimal
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
    }
  };

  const switchNetwork = async (networkKey: string) => {
    if (!window.ethereum) return;
    const net = NETWORKS[networkKey];
    if (!net) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: net.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [net],
          });
        } catch (addError) {
          console.error("Failed to add network", addError);
        }
      }
    }
  };

  useEffect(() => {
    if (user && network) {
        switchNetwork(network);
    }
  }, [network, user]);

  useEffect(() => {
    if (isVotingActive && votingTimeRemaining > 0 && executionStatus === 'PENDING') {
      const timer = setInterval(() => {
        setVotingTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isVotingActive, votingTimeRemaining, executionStatus]);

  const executeProposals = () => {
    if (proposals.length === 0) return;

    // specific logic: Find proposal with highest votes
    // In a real app this would be backend logic
    const sorted = [...proposals].sort((a, b) => Number(b.vote_count) - Number(a.vote_count));
    const winningProposal = sorted[0];

    setWinner(winningProposal);
    setExecutionStatus('EXECUTED');
    setIsVotingActive(false); // Stop timer

    // Mock Notification
    const newNotification = {
      id: Date.now(),
      message: `Proposal "${winningProposal.title}" has been executed with ${winningProposal.vote_count} votes!`,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);

    alert(`Execution Complete! Winner: ${winningProposal.title}`);
  };

  // Fetch proposals on mount and poll
  useEffect(() => {
    fetchProposals();
    const interval = setInterval(fetchProposals, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchProposals = async () => {
    const data = await api.getProposals();
    setProposals(data);
  };

  const connectWallet = async (intendedRole?: string, manualAddress?: string) => {
    setIsLoading(true);
    try {
      let addr = manualAddress || "";
      
      if (!addr) {
          if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            if (accounts.length > 0) addr = accounts[0];
          } else {
            // Fallback mock
            addr = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
            alert("Using Mock Wallet: " + addr);
          }
      }

      if (addr) {
        const userData = await api.getUserData(addr);
        // Allow upgrade if specifically requested for this session
        const role = intendedRole || userData.role;

        setUser({ wallet: addr, role: role, votes: userData.votes || [] });

        // Fetch notifications
        const notifs = await api.getNotifications(addr);
        setNotifications(notifs);

        localStorage.setItem('connected_wallet', addr);
      }
    } catch (e) {
      console.error("Wallet connection failed", e);
    }
    setIsLoading(false);
  };

  const disconnectWallet = () => {
    setUser(null);
    localStorage.removeItem('connected_wallet');
  };

  const createProposal = async (data: { title: string, description: string, tags: string[], amount: string, recipient: string, duration: number, voting_model: string, venue?: string, host?: string }) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await api.createProposal({
        ...data,
        proposer_wallet: user.wallet
      });
      await fetchProposals();
      // Update role locally to PROPOSER if successful
      setUser({ ...user, role: 'PROPOSER' });

      // Start Timer Simulation
      setIsVotingActive(true);
      setVotingTimeRemaining(120); // Reset to 2 mins
      setExecutionStatus('PENDING'); // Reset execution
    } catch (e) {
      console.error("Failed to create proposal", e);
      alert("Failed to create proposal");
    }
    setIsLoading(false);
  };

  const voteOnProposal = async (id: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await api.voteProposal(id, user.wallet);
      if (res.error) {
        alert(res.error);
      } else {
        // Optimistic update or refetch
        await fetchProposals();
        setUser({ ...user, votes: [...user.votes, id] });
      }
    } catch (e: any) {
      alert(e.message || "Vote failed");
    }
    setIsLoading(false);
  };

  return (
    <AppContext.Provider value={{
      user,
      proposals,
      isLoading,
      connectWallet,
      disconnectWallet,
      createProposal,
      voteOnProposal,
      notifications,
      votingTimeRemaining,
      executionStatus,
      executeProposals,
      winner,
      network,
      setNetwork
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
