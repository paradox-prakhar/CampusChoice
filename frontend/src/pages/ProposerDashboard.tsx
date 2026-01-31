import { CreateProposalForm } from '../components/CreateProposalForm';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Timer, ArrowRight, Play } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 py-8">
       <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
              <h1 className="text-3xl font-bold text-white">Proposer Dashboard</h1>
              <p className="text-slate-400">Submit new events and track your impact.</p>
          </div>

          {/* Timer & Execution Control */}
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-6 backdrop-blur-sm self-start md:self-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                        <Timer className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Voting Ends In</p>
                        <p className="text-xl font-bold font-mono text-white">{formatTime(votingTimeRemaining)}</p>
                    </div>
                </div>
                
                <div className="h-8 w-px bg-slate-800"></div>

                <Button 
                    onClick={executeProposals} 
                    disabled={votingTimeRemaining > 0 || executionStatus === 'EXECUTED'}
                    variant={executionStatus === 'EXECUTED' ? 'outline' : 'default'}
                    className={executionStatus === 'EXECUTED' ? 'border-green-500/50 text-green-400' : ''}
                >
                    {executionStatus === 'EXECUTED' ? (
                        <>Executed <ArrowRight className="w-4 h-4 ml-2" /></>
                    ) : (
                        <>Execute Results <Play className="w-4 h-4 ml-2" /></>
                    )}
                </Button>
            </div>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div>
               <h2 className="text-xl font-semibold text-white mb-4">Create New Proposal</h2>
               <CreateProposalForm />
           </div>
           
           <div>
                <h2 className="text-xl font-semibold text-white mb-4">Your Proposals & Activity</h2>
                <div className="flex flex-col gap-4">
                    {proposals.length === 0 ? (
                        <div className="p-8 text-center border border-slate-800 rounded-xl bg-slate-900/30 text-slate-500">
                            No proposals found. Create one to get started!
                        </div>
                    ) : (
                        proposals.map(p => (
                            <ProposalCard key={p.id} proposal={p} />
                        ))
                    )}
                </div>
           </div>
       </div>
    </div>
  );
}
