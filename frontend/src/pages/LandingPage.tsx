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
          <Button variant="outline" size="lg" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full px-8 text-base">
            Learn How It Works
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-800/30 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              VibeCraft DAO empowers students to democratically decide campus events through blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Connect Your Wallet</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Connect your MetaMask wallet to get started. Choose whether you want to vote on proposals or create your own event proposal.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Browse or Propose</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Explore trending event proposals or create your own. Proposers submit event details, budget requirements, and timeline for community review.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Vote with Tokens</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Use quadratic voting to support proposals. Your voting power is the square root of tokens committed, ensuring fair representation for all students.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-yellow-500/50 transition-all">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  4
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Event Gets Funded</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  When a proposal passes, funds are automatically released from the DAO treasury. The event organizer can proceed with making it happen!
                </p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Why Quadratic Voting?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Prevents Plutocracy</h4>
                  <p className="text-slate-400 text-sm">
                    Unlike traditional voting where 1 token = 1 vote, quadratic voting prevents wealthy individuals from dominating decisions. The cost increases exponentially with each additional vote.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Encourages Participation</h4>
                  <p className="text-slate-400 text-sm">
                    Every student's voice matters. Even with fewer tokens, you can still have meaningful impact by focusing your votes on proposals you care deeply about.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Transparent & Immutable</h4>
                  <p className="text-slate-400 text-sm">
                    All votes are recorded on the blockchain. No one can manipulate results, and anyone can verify the outcome at any time.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Automated Execution</h4>
                  <p className="text-slate-400 text-sm">
                    Smart contracts automatically release funds when proposals pass. No bureaucracy, no delays - just instant action.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
