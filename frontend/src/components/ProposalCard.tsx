import { useState, useEffect } from 'react';
import { Proposal } from '../types';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatAddress } from '../lib/utils';
import { Clock, ThumbsUp, ThumbsDown, Tag, MapPin, User as UserIcon } from 'lucide-react';

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const { voteOnProposal, user, isLoading } = useApp();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const end = new Date(proposal.vote_end).getTime();
        const distance = end - now;

        if (distance < 0) {
            setTimeLeft("Ended");
            setIsExpired(true);
            return;
        }

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        setIsExpired(false);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [proposal.vote_end]);

  const statusColor = {
      'DRAFT': 'secondary',
      'SUBMITTED': 'warning',
      'VOTING': 'default',
      'APPROVED': 'success',
      'ARCHIVED': 'outline'
  } as const;

  const displayStatus = isExpired && proposal.status === 'VOTING' ? 'ENDED' : proposal.status;

  return (
    <div className={`group relative glass-panel rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col h-full animate-fade-in ${proposal.status === 'VOTING' && !isExpired ? 'neon-border ring-1 ring-cyan-500/20' : 'border border-white/5'}`}>
      <div className="flex justify-between items-start mb-4">
        <Badge variant={statusColor[proposal.status] || 'default'} className="px-3 py-1 rounded-full uppercase tracking-wider text-[10px] font-bold">
            {displayStatus}
        </Badge>
        <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono bg-slate-900/50 px-2.5 py-1 rounded-full border border-white/5">
           <Clock className={`w-3 h-3 ${isExpired ? "text-red-400" : "text-cyan-400 animate-pulse"}`} />
           <span className={isExpired ? "text-red-400" : "text-cyan-400"}>{timeLeft}</span>
           <span className="text-slate-700">|</span>
           {new Date(proposal.vote_end).toLocaleDateString()}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
        {proposal.title}
      </h3>
      <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">
        {proposal.description}
      </p>

      {/* Venue and Host Details */}
      {(proposal.venue || proposal.host) && (
        <div className="flex flex-col gap-2 mb-6 text-[11px] text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
            {proposal.venue && (
                <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{proposal.venue}</span>
                </div>
            )}
            {proposal.host && (
                <div className="flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span className="opacity-80">Host: {proposal.host}</span>
                </div>
            )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {proposal.tags.map(tag => (
            <span key={tag} className="text-[10px] font-medium bg-slate-900/80 text-cyan-400/80 px-2.5 py-1 rounded-lg border border-cyan-500/20 flex items-center gap-1.5 group-hover:bg-cyan-500/10 transition-colors">
                <Tag className="w-3 h-3" /> {tag}
            </span>
        ))}
      </div>

      <div className="mt-auto space-y-5">
          <div className="flex justify-between items-center text-xs text-slate-500 border-t border-white/5 pt-4">
            <div className="flex items-center gap-2" title="Proposer">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/10"></div>
                <span className="font-medium tracking-tight">{formatAddress(proposal.proposer_wallet)}</span>
            </div>
          </div>

          <div className="bg-slate-950/40 rounded-xl p-4 flex justify-between items-center border border-white/5">
             <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Community Interest</span>
                <span className="text-xs text-slate-400">Total Votes Cast</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                <span className="text-xl font-black text-cyan-400 tracking-tighter">{proposal.vote_count}</span>
             </div>
          </div>

        {proposal.status === 'VOTING' && user && !isExpired && (
          <div className="flex gap-3 pt-2">
            <Button 
                size="sm" 
                className={`flex-1 rounded-xl h-11 font-bold tracking-wide transition-all duration-300 ${user.votes.includes(proposal.id) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 border-0'}`}
                onClick={() => voteOnProposal(proposal.id)}
                isLoading={isLoading}
                disabled={user.votes.includes(proposal.id)}
                variant={user.votes.includes(proposal.id) ? 'outline' : 'default'}
            >
                <ThumbsUp className="w-4 h-4 mr-2" /> 
                {user.votes.includes(proposal.id) ? 'Voted' : 'Yes'}
            </Button>
            <Button 
                size="sm" 
                className="flex-1 rounded-xl h-11 font-bold tracking-wide bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 hover:border-red-500/50 hover:text-red-400 transition-all duration-300"
                onClick={() => voteOnProposal(proposal.id)}
                isLoading={isLoading}
                disabled={user.votes.includes(proposal.id)}
                variant="outline"
            >
                <ThumbsDown className="w-4 h-4 mr-2" /> No
            </Button>
          </div>
        )}
        
        {isExpired && (
             <div className="text-center p-3 bg-slate-950/60 rounded-xl border border-white/5 text-slate-500 font-bold uppercase tracking-widest text-[10px] backdrop-blur-sm">
                Session Completed
             </div>
        )}
      </div>
    </div>
  );
}
