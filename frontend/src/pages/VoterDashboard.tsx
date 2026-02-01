import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProposalCard } from '../components/ProposalCard';
import { Button } from '../components/ui/Button';
import { Search } from 'lucide-react';

export function VoterDashboard() {
  const { proposals } = useApp();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = proposals.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    if (filter === 'ALL') return matchesSearch;
    return matchesSearch && p.status === filter;
  });

  // const getMyVotes = () => { ... } removed to fix lint

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Event Proposals</h1>
          <p className="text-slate-400">Browse {filtered.length} active proposals and cast your votes.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Your Power</span>
            <span className="text-xl font-bold text-indigo-400">100 VP</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full bg-slate-800 border-none rounded-lg pl-10 h-10 text-white focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['ALL', 'VOTING', 'APPROVED', 'ENDED'].map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(f)}
              className="whitespace-nowrap"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
          <h3 className="text-xl font-bold text-slate-300 mb-2">No events found</h3>
          <p className="text-slate-500">Try adjusting your filters or be the first to propose something!</p>
        </div>
      )}
    </div>
  );
}
