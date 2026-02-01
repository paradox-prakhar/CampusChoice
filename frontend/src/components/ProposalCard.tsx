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
    <div className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <Badge variant={statusColor[proposal.status] || 'default'}>
            {displayStatus}
        </Badge>
        <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
           <Clock className="w-3 h-3" />
           <span className={isExpired ? "text-red-400" : "text-indigo-400"}>{timeLeft}</span>
           <span className="text-slate-600">|</span>
           {new Date(proposal.vote_end).toLocaleDateString()}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-100 mb-2 truncate group-hover:text-indigo-400 transition-colors">
        {proposal.title}
      </h3>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">
        {proposal.description}
      </p>

      {/* Venue and Host Details */}
      {(proposal.venue || proposal.host) && (
        <div className="flex flex-col gap-1 mb-4 text-xs text-slate-400 bg-slate-900/30 p-2 rounded-lg">
            {proposal.venue && (
                <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-indigo-400" />
                    <span>{proposal.venue}</span>
                </div>
            )}
            {proposal.host && (
                <div className="flex items-center gap-2">
                    <UserIcon className="w-3 h-3 text-purple-400" />
                    <span>Host: {proposal.host}</span>
                </div>
            )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {proposal.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-slate-900/50 text-slate-400 px-2 py-1 rounded-md border border-slate-700/50 flex items-center gap-1">
                <Tag className="w-3 h-3" /> {tag}
            </span>
        ))}
      </div>

      <div className="mt-auto space-y-4">
          <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-700/50 pt-3">
            <div className="flex items-center gap-1.5" title="Proposer">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                <span>{formatAddress(proposal.proposer_wallet)}</span>
            </div>
            
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3 flex justify-between items-center">
             <span className="text-xs text-slate-500">Total Votes</span>
             <span className="font-bold text-indigo-400">{proposal.vote_count}</span>
          </div>

        {proposal.status === 'VOTING' && user && !isExpired && (
          <div className="flex gap-2">
            <Button 
                size="sm" 
                className="flex-1 bg-green-600 hover:bg-green-700 border-green-500"
                onClick={() => voteOnProposal(proposal.id)}
                isLoading={isLoading}
                disabled={user.votes.includes(proposal.id)}
                variant={user.votes.includes(proposal.id) ? 'outline' : 'default'}
            >
                <ThumbsUp className="w-4 h-4 mr-1" /> 
                {user.votes.includes(proposal.id) ? 'Voted Yes' : 'Yes'}
            </Button>
            <Button 
                size="sm" 
                className="flex-1 bg-red-600 hover:bg-red-700 border-red-500"
                onClick={() => voteOnProposal(proposal.id)}
                isLoading={isLoading}
                disabled={user.votes.includes(proposal.id)}
                variant="outline"
            >
                <ThumbsDown className="w-4 h-4 mr-1" /> No
            </Button>
          </div>
        )}
        
        {isExpired && (
             <div className="text-center p-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-400 text-sm">
                Voting Ended
             </div>
        )}
      </div>
    </div>
  );
}
