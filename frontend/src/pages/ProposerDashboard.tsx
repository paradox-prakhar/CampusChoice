import { CreateProposalForm } from '../components/CreateProposalForm';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Timer, ArrowRight, Play, Plus, LayoutDashboard } from 'lucide-react';
import { ProposalCard } from '../components/ProposalCard';

export function ProposerDashboard() {
  const { votingTimeRemaining, executeProposals, executionStatus, proposals } = useApp();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = (seconds % 60).toString().padStart(2, '0');
    
    // Only show hours if relevant or requested pattern like :hh:mm::ss
    // User requested :hh:mm::ss format specifically
    const h = hours.toString().padStart(2, '0');
    const m = mins.toString().padStart(2, '0');
    
    return `${h}:${m}:${secs}`;
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background Blobs */}
      <div className="bg-blob -top-20 -left-20 opacity-40 shadow-cyan-500/20" />
      <div className="bg-blob top-1/2 -right-40 opacity-30 shadow-purple-500/20 [animation-delay:-10s]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 space-y-12">
       <div className="flex flex-col md:flex-row justify-between items-end gap-6 animate-fade-in">
          <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Proposer Dashboard</h1>
              <p className="text-slate-400 mt-2 text-lg">Lead the community by drafting high-impact event proposals.</p>
          </div>

          {/* Timer & Execution Control */}
            <div className="p-1 glass-panel rounded-2xl shadow-2xl flex items-center self-start md:self-auto overflow-hidden animate-fade-in [animation-delay:200ms]">
                <div className="bg-slate-900/50 p-4 flex items-center gap-6 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 animate-float border border-cyan-500/20">
                            <Timer className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Election Window Ends</p>
                            <p className="text-2xl font-black font-mono text-white tracking-tighter">{formatTime(votingTimeRemaining)}</p>
                        </div>
                    </div>
                    
                    <div className="h-10 w-px bg-white/5"></div>

                    <Button 
                        onClick={executeProposals} 
                        disabled={votingTimeRemaining > 0 || executionStatus === 'EXECUTED'}
                        variant={executionStatus === 'EXECUTED' ? 'outline' : 'default'}
                        className={`h-12 px-6 rounded-xl font-bold transition-all duration-300 ${executionStatus === 'EXECUTED' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 border-0'}`}
                    >
                        {executionStatus === 'EXECUTED' ? (
                            <div className="flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 text-emerald-400" />
                                <span>Results Finalized</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Play className="w-4 h-4" />
                                <span>Execute Voting</span>
                            </div>
                        )}
                    </Button>
                </div>
            </div>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-fade-in [animation-delay:400ms]">
                <h2 className="text-2xl font-black text-white mb-8 tracking-tighter flex items-center gap-4">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 border border-white/5">
                        <Plus className="w-6 h-6" />
                    </div>
                    Draft Initiative
                </h2>
                <div className="glass-panel p-1 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="bg-slate-900/40 rounded-2xl p-6">
                        <CreateProposalForm />
                    </div>
                </div>
            </div>
            
            <div className="animate-fade-in [animation-delay:600ms]">
                 <h2 className="text-2xl font-black text-white mb-8 tracking-tighter flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 border border-white/5">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    Community Pulse
                 </h2>
                 <div className="flex flex-col gap-8">
                     {proposals.length === 0 ? (
                         <div className="empty-state-card p-16 text-center rounded-[2rem] text-slate-500 hover:text-slate-400 border-dashed border-2">
                             <h4 className="text-xl font-bold mb-2">No active ecosystems</h4>
                             <p className="text-sm">Initiate the first proposal to spark the community!</p>
                         </div>
                     ) : (
                         proposals.map((p, index) => (
                             <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${(index + 8) * 100}ms` }}>
                                <ProposalCard proposal={p} />
                             </div>
                         ))
                     )}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
