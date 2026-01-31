import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import WalletConnect from './components/WalletConnect'
import ProposalForm from './components/ProposalForm'
import ProposalList from './components/ProposalList'
import './index.css'

function App() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);

  // Mock Contract Objects for UI Demo
  const mockDaoContract = {
    createProposal: async (ipfs, amount, recipient, duration) => {
      console.log("Mock Create:", ipfs, amount, recipient);
      // Add to local storage for demo
      const current = JSON.parse(localStorage.getItem('proposals') || '[]');
      current.push({
        id: current.length,
        ipfsHash: ipfs,
        amount, // amount is already a BigInt from ethers parsing? No, ethers.parseEther returns BigInt.
        // Wait, if amount is BigInt, we need to stringify it too!
        recipient,
        yesVotes: "0",
        noVotes: "0",
        deadline: (Math.floor(Date.now() / 1000) + duration).toString(),
        executed: false
      });
      // We must handle 'amount' which comes in as BigInt from ProposalForm
      const stored = current.map(p => ({
        ...p,
        amount: p.amount.toString()
      }));
      localStorage.setItem('proposals', JSON.stringify(stored));
      return { wait: async () => Promise.resolve() };
    },
    vote: async (id, support) => {
      console.log("Mock Vote:", id, support);
      const current = JSON.parse(localStorage.getItem('proposals') || '[]');
      if (current[id]) {
        if (support) {
          const val = BigInt(current[id].yesVotes || "0") + BigInt("100000000000000000000");
          current[id].yesVotes = val.toString();
        } else {
          const val = BigInt(current[id].noVotes || "0") + BigInt("50000000000000000000");
          current[id].noVotes = val.toString();
        }
        localStorage.setItem('proposals', JSON.stringify(current));
      }
      return { wait: async () => Promise.resolve() };
    },
    execute: async (id) => {
      const current = JSON.parse(localStorage.getItem('proposals') || '[]');
      if (current[id]) {
        current[id].executed = true;
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
            <div className="card">
              <h2>Dashboard</h2>
              <p style={{ marginBottom: '1rem' }}>
                Welcome back, <code>{address.slice(0, 6)}...{address.slice(-4)}</code>.
                <br />
                <small style={{ color: 'orange' }}>Demo Mode: Contracts are simulated.</small>
              </p>
            </div>

            <ProposalForm
              daoContract={mockDaoContract}
              voteTokenContract={null}
              signer={signer}
            />

            <ProposalList
              daoContract={mockDaoContract}
              voteTokenContract={null}
              signer={signer}
              address={address}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default App
