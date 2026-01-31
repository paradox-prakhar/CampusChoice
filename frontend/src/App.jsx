import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import WalletConnect from './components/WalletConnect'
import ProposalForm from './components/ProposalForm'
import ProposalList from './components/ProposalList'
import VoterDashboard from './components/VoterDashboard'
import './index.css'

function App() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals' or 'dashboard'

  // Mock Contract Objects for UI Demo
  // Mock Config
  const [mockConfig, setMockConfig] = useState({
    minTokens: 100, // 100 mock tokens
    fee: 0.01 // ETH
  });

  const mockTokenContract = {
    balanceOf: async (addr) => {
      // Check local storage for mock balance
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
    // Config
    config: async () => {
      return {
        minTokensToPropose: BigInt(mockConfig.minTokens * 1e18),
        proposalFee: ethers.parseEther(mockConfig.fee.toString()),
        feeRefundable: true
      };
    },

    createProposal: async (ipfs, amount, recipient, duration, votingType, feeValue) => {
      console.log("Mock Create:", ipfs, amount, recipient, votingType, feeValue);

      // 1. Check Threshold (Mock Balance Check)
      // Since we don't track user balance in contract state here, we rely on Frontend to assume checking.
      // But actually, we should implement a Mock Token Balance in App state to make this realistic!
      // Let's assume the user has balance. We will fail if balance < minTokens.
      const currentBalance = parseFloat(ethers.formatEther(await mockTokenContract.balanceOf(address)));
      if (currentBalance < mockConfig.minTokens) {
        throw new Error("Insufficient tokens to propose (Min: " + mockConfig.minTokens + ")");
      }

      // 2. Check Fee
      // In mock, feeValue is a prompt.
      if (parseFloat(ethers.formatEther(feeValue)) < mockConfig.fee) {
        throw new Error("Insufficient Proposal Fee (Req: " + mockConfig.fee + " ETH)");
      }

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
        votingType: votingType, // 0 = Weighted, 1 = Quadratic
        feePaid: feeValue.toString(),
        proposer: address
      });
      localStorage.setItem('proposals', JSON.stringify(current));
      return { wait: async () => Promise.resolve() };
    },

    vote: async (id, support, tokenAmount) => {
      console.log("Mock Vote:", id, support, tokenAmount);
      const current = JSON.parse(localStorage.getItem('proposals') || '[]');
      const proposal = current[id];

      if (proposal) {
        let weight = BigInt(0);

        // Mock Token Balance
        const balance = await mockTokenContract.balanceOf(address);

        if (proposal.votingType == 1) {
          // Quadratic
          // Logic: Weight = Sqrt(Tokens Used)
          // We simulate transfer by just calculating sqrt
          // const tokensUsed = BigInt(tokenAmount); // Input from UI?
          // For MVP UI, let's assume "Use All Balance" or input. 
          // In App.jsx mock, let's accept tokenAmount arg.
          const used = BigInt(tokenAmount);
          // Sqrt approximation for BigInt
          // Simplistic: Math.sqrt(Number(used)) -- unsafe for huge numbers but ok for mock
          const val = Math.sqrt(Number(ethers.formatEther(used)));
          // Scale back up? No, weight is just raw count.
          // Wait, standard Q-voting: 1 token = 1 credit. 
          // if I use 100 tokens, I get 10 votes.
          weight = BigInt(Math.floor(val) * 1e18); // giving 18 decimals back to "votes"
        } else {
          // Weighted
          weight = balance;
        }

        if (support) {
          current[id].yesVotes = (BigInt(current[id].yesVotes || "0") + weight).toString();
        } else {
          current[id].noVotes = (BigInt(current[id].noVotes || "0") + weight).toString();
        }
        localStorage.setItem('proposals', JSON.stringify(current));
      }
      return { wait: async () => Promise.resolve() };
    },

    execute: async (id) => {
      const current = JSON.parse(localStorage.getItem('proposals') || '[]');
      if (current[id]) {
        current[id].executed = true;
        // Mock Refund
        console.log("Mock Execute: Refunding fee if passed...");
        localStorage.setItem('proposals', JSON.stringify(current));
      }
      return { wait: async () => Promise.resolve() };
    },
    getProposalsCount: async () => {
      const current = JSON.parse(localStorage.getItem('proposals') || '[]');
      return BigInt(current.length);
    },
    proposals: async (index) => {
      const current = JSON.parse(localStorage.getItem('proposals') || '[]');
      return current[index];
    }
  };

  const handleConnect = (signer, address) => {
    setSigner(signer);
    setAddress(address);
  };

  // Clear mock data on reload for clean demo? No, keep it.
  // localStorage.clear(); 

  return (
    <div className="app-container">
      <WalletConnect onConnect={handleConnect} />

      <main>
        <h1>NextGen Tech Events</h1>

        {!signer && (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>Welcome to the Future of Funding</h2>
            <p style={{ color: 'var(--color-text-dim)', marginBottom: '2rem' }}>
              Connect your wallet to propose events, vote on funding, and shape the campus tech culture.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <span className="badge badge-green">Polygon Network</span>
              <span className="badge badge-green">AI Powered</span>
            </div>
          </div>
        )}

        {signer && (
          <>
            <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0 }}>Logged in as: <code>{address.slice(0, 6)}...{address.slice(-4)}</code></p>
                <small style={{ color: 'orange' }}>Demo Mode: Contracts are simulated.</small>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setActiveTab('proposals')}
                  style={{ background: activeTab === 'proposals' ? 'var(--color-primary)' : 'var(--color-surface)' }}
                >
                  Proposals
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  style={{ background: activeTab === 'dashboard' ? 'var(--color-primary)' : 'var(--color-surface)' }}
                >
                  📊 Voter Dashboard
                </button>
              </div>
            </div>

            {activeTab === 'proposals' ? (
              <>
                <ProposalForm
                  daoContract={mockDaoContract}
                  voteTokenContract={mockTokenContract}
                  signer={signer}
                  address={address}
                />
              </>
            ) : (
              <VoterDashboard
                daoContract={mockDaoContract}
                voteTokenContract={mockTokenContract}
                address={address}
                signer={signer}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
export default App
