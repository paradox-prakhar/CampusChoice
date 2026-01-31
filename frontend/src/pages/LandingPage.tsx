import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { ArrowRight, Lock, Users, Zap } from 'lucide-react';
import { ProposalCard } from '../components/ProposalCard';
import { ConnectPurposeModal } from '../components/ConnectPurposeModal';

export function LandingPage() {
  const { connectWallet, user, proposals } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleConnectPurpose = async (purpose: 'VOTE' | 'PROPOSE') => {
    setIsModalOpen(false);
    await connectWallet(purpose === 'PROPOSE' ? 'PROPOSER' : undefined);
    
    // Slight delay to allow state update
    setTimeout(() => {
        if (purpose === 'PROPOSE') {
            // In a real app we might trigger a role upgrade here
            navigate('/create');
        } else {
            navigate('/dashboard');
        }
    }, 100);
  };



  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <ConnectPurposeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleConnectPurpose} 
      />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 pb-4 mb-6 max-w-4xl tracking-tight">
          Vote for the Events You Want on Campus
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          The first decentralized platform where students decide the university's social calendar. 
          Propose events, secure funding, and govern with quadratic voting.
        </p>
        


        <div className="flex flex-col sm:flex-row gap-4 z-10">
          {user ? (
             <Link to="/dashboard">
                <Button size="lg" className="rounded-full px-8 text-base">
                   Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
             </Link>
          ) : (
             <Button size="lg" onClick={() => setIsModalOpen(true)} className="rounded-full px-8 text-base bg-white text-slate-900 hover:bg-slate-200">
                Connect Wallet & Vote
             </Button>
          )}
          <Button variant="outline" size="lg" className="rounded-full px-8 text-base">
             Learn How It Works
          </Button>
        </div>
      </section>

      {/* Stats / Features */}
      <section className="border-y border-slate-800 bg-slate-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 text-indigo-400">
                    <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Quadratic Voting</h3>
                <p className="text-slate-400 text-sm">Your vote power is the square root of your tokens. Fairer influence for everyone.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-400">
                    <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Secure & Transparent</h3>
                <p className="text-slate-400 text-sm">All proposals and votes are recorded on-chain. No rigged elections.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 text-green-400">
                    <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Community Led</h3>
                <p className="text-slate-400 text-sm">Students propose, students vote. You decide where the budget goes.</p>
            </div>
        </div>
      </section>

      {/* Featured Proposals */}
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Trending Proposals</h2>
                <p className="text-slate-400">See what your peers are voting for right now.</p>
            </div>
            <Link to="/dashboard">
                <Button variant="link" className="text-indigo-400">View All</Button>
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.slice(0, 3).map(p => (
                <ProposalCard key={p.id} proposal={p} />
            ))}
        </div>
      </section>
    </div>
  );
}
