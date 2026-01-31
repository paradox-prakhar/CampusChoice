import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import WalletConnect from './components/WalletConnect'
import ProposalForm from './components/ProposalForm'
import VoterDashboard from './components/VoterDashboard'
import NotificationBell from './components/NotificationBell'
import './index.css'

function App() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals' or 'dashboard'
  const [notifications, setNotifications] = useState([]);

  const addNotification = (msg) => {
    const newNote = {
      id: Date.now(),
      message: msg,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Mock Config
  const [mockConfig, setMockConfig] = useState({
    minTokens: 100, // 100 mock tokens
    fee: 0.01 // ETH
  });

  const mockTokenContract = {
    balanceOf: async (addr) => {
      const balances = JSON.parse(localStorage.getItem('balances') || '{}');
      return BigInt(balances[addr] || "0");
    },
    mint: async (addr, amount) => {
      const balances = JSON.parse(localStorage.getItem('balances') || '{}');
      const current = BigInt(balances[addr] || "0");
      balances[addr] = (current + amount).toString();
      localStorage.setItem('balances', JSON.stringify(balances));
      return { wait: async () => Promise.resolve() };
    }
  };

  const mockDaoContract = {
    config: async () => ({
      minTokensToPropose: BigInt(mockConfig.minTokens * 1e18),
      proposalFee: ethers.parseEther(mockConfig.fee.toString()),
      feeRefundable: true
    }),
    createProposal: async (ipfs, amount, recipient, duration, votingType, feeValue) => {
      const currentBalance = parseFloat(ethers.formatEther(await mockTokenContract.balanceOf(address)));
      if (currentBalance < mockConfig.minTokens) throw new Error("Insufficient tokens (Min: " + mockConfig.minTokens + ")");
      if (parseFloat(ethers.formatEther(feeValue)) < mockConfig.fee) throw new Error("Insufficient Fee");

      const current = JSON.parse(localStorage.getItem('proposals') || '[]');
      current.push({
        id: current.length,
        ipfsHash: ipfs,
        amount: amount.toString(),
        recipient,
        yesVotes: "0",
        noVotes: "0",
        deadline: (Math.floor(Date.now() / 1000) + duration).toString(),
        executed: false,
        votingType: votingType,
        feePaid: feeValue.toString(),
        proposer: address
      });
      localStorage.setItem('proposals', JSON.stringify(current));
      addNotification(`New Proposal Created: ${JSON.parse(ipfs).title}`);
      return { wait: async () => Promise.resolve() };
    },
    vote: async (id, support, tokenAmount) => {
      const current = JSON.parse(localStorage.getItem('proposals') || '[]');
      const proposal = current[id];
      if (proposal) {
        let weight = BigInt(0);
        const balance = await mockTokenContract.balanceOf(address);
        if (proposal.votingType == 1) {
          const val = Math.sqrt(Number(ethers.formatEther(tokenAmount || "0")));
          weight = BigInt(Math.floor(val) * 1e18);
        } else {
          weight = balance;
        }

        if (support) proposal.yesVotes = (BigInt(proposal.yesVotes || "0") + weight).toString();
        else proposal.noVotes = (BigInt(proposal.noVotes || "0") + weight).toString();

        localStorage.setItem('proposals', JSON.stringify(current));
      }
      return { wait: async () => Promise.resolve() };
    },
    execute: async (id) => {
      const current = JSON.parse(localStorage.getItem('proposals') || '[]');
      if (current[id]) {
        current[id].executed = true;
        localStorage.setItem('proposals', JSON.stringify(current));
        addNotification(`Proposal #${id} executed`);
      }
      return { wait: async () => Promise.resolve() };
    },
    getProposalsCount: async () => BigInt(JSON.parse(localStorage.getItem('proposals') || '[]').length),
    proposals: async (index) => JSON.parse(localStorage.getItem('proposals') || '[]')[index]
  };

  const handleConnect = (signer, address) => {
    setSigner(signer);
    setAddress(address);
    addNotification("Wallet Connected Successfully");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30">
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg shadow-lg shadow-indigo-500/20"></div>
            <span className="font-bold text-xl tracking-tight">VibeCraft<span className="text-indigo-400">DAO</span></span>
          </div>

          {signer && (
            <div className="flex items-center gap-6">
              <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'proposals' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Proposals
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Dashboard
                </button>
              </div>

              <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
                <NotificationBell notifications={notifications} onMarkRead={markRead} />
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-400 font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  <span className="text-[10px] text-green-400 bg-green-900/20 px-1.5 rounded border border-green-900/30">Connected</span>
                </div>
              </div>
            </div>
          )}

          {!signer && (
            <div className="flex items-center">
              <WalletConnect onConnect={handleConnect} variant="navbar" />
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!signer ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6 max-w-lg">
              <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 pb-2">
                NextGen Funding
              </h1>
              <p className="text-slate-400 text-lg">
                Empower your campus tech culture. Propose events, vote with quadratic power, and shape the future.
              </p>
              {/* Removed WalletConnect from Hero */}
              <div className="flex gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-all">
                  Explore Events
                </button>
                <button className="px-8 py-3 bg-slate-800 text-white border border-slate-700 rounded-full font-bold hover:bg-slate-700 transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {activeTab === 'proposals' ? (
              <div className="max-w-3xl mx-auto">
                <ProposalForm
                  daoContract={mockDaoContract}
                  voteTokenContract={mockTokenContract}
                  signer={signer}
                  address={address}
                />
              </div>
            ) : (
              <VoterDashboard
                daoContract={mockDaoContract}
                voteTokenContract={mockTokenContract}
                address={address}
                signer={signer}
                onNotification={addNotification}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
export default App
