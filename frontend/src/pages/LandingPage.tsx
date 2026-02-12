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
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:2s] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6 animate-fade-in">
                <Zap className="w-3 h-3" />
                <span>EXPERIENCE THE FUTURE OF GOVERNANCE</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 pb-4 mb-6 max-w-4xl tracking-tighter animate-fade-in [animation-delay:200ms]">
                University Social Calendar, <span className="text-cyan-400">Decentralized.</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in [animation-delay:400ms]">
                Propose events, secure funding, and govern with quadratic voting. The first platform where students actually decide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:600ms]">
            {user ? (
                <Link to="/dashboard">
                <Button size="lg" className="rounded-full px-10 py-6 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                    Explore Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                </Link>
            ) : (
                <Button size="lg" onClick={() => setIsModalOpen(true)} className="rounded-full px-10 py-6 text-lg bg-white text-slate-900 hover:bg-slate-200 shadow-xl transition-all">
                Connect Wallet & Vote
                </Button>
            )}
            <Button variant="ghost" size="lg" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full px-8 text-base border border-white/10 hover:bg-white/5 transition-all">
                Learn How It Works
            </Button>
            </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-800/30 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              CampusChoice empowers students to democratically decide campus events through blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Step 1 */}
            <div className="relative group animate-fade-in [animation-delay:100ms]">
              <div className="glass-panel rounded-2xl p-6 h-full border border-white/5 hover:border-cyan-500/50 transition-all duration-500">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Connect Wallet</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Securely link your identity. Choose whether you want to influence voting or propose new initiatives.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group animate-fade-in [animation-delay:200ms]">
              <div className="glass-panel rounded-2xl p-6 h-full border border-white/5 hover:border-purple-500/50 transition-all duration-500">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Browse or Propose</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Explore high-impact proposals or lead innovation by drafting your own vision for campus life.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group animate-fade-in [animation-delay:300ms]">
              <div className="glass-panel rounded-2xl p-6 h-full border border-white/5 hover:border-emerald-500/50 transition-all duration-500">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Quadratic Vote</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Combat plutocracy. Use our fair governance model where impact is distributed across the community fairly.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group animate-fade-in [animation-delay:400ms]">
              <div className="glass-panel rounded-2xl p-6 h-full border border-white/5 hover:border-orange-500/50 transition-all duration-500">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  4
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Instant Funding</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Automated smart contracts release funds instantly once a proposal passes. No delays, just progress.
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
