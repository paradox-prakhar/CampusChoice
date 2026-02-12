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
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background Blobs */}
      <div className="bg-blob -top-20 -left-20 opacity-40 shadow-cyan-500/20" />
      <div className="bg-blob top-1/2 -right-40 opacity-30 shadow-purple-500/20 [animation-delay:-10s]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 space-y-10">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Event Proposals</h1>
            <p className="text-slate-400 mt-2 text-lg">Browse and influence {filtered.length} community-driven initiatives.</p>
          </div>
          <div className="flex gap-2 animate-fade-in [animation-delay:200ms]">
            <div className="glass-panel p-5 rounded-3xl border border-white/10 shadow-2xl shadow-cyan-500/5">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] block mb-2">Voting Credit</span>
              <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                  <span className="text-3xl font-black text-white tracking-tighter">100 <span className="text-cyan-500 text-sm">VP</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 glass-panel p-2 rounded-2xl border border-white/5 animate-fade-in [animation-delay:300ms] shadow-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search proposals by title or tag..."
              className="w-full bg-transparent border-none rounded-xl pl-16 h-14 text-white placeholder:text-slate-500 focus:ring-0 text-lg transition-all outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 p-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {['ALL', 'VOTING', 'APPROVED', 'ENDED'].map(f => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap rounded-xl px-6 h-12 font-black tracking-widest text-[11px] transition-all duration-300 ${filter === f ? 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-xl shadow-cyan-500/30 ring-1 ring-white/20' : 'hover:bg-white/5 text-slate-400'}`}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, index) => (
              <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${(index + 4) * 100}ms` }}>
                  <ProposalCard proposal={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-card rounded-[2rem] p-20 flex flex-col items-center text-center animate-fade-in [animation-delay:500ms] border-dashed border-2 border-white/10 group">
            <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative">
                <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full animate-pulse"></div>
                <Search className="w-10 h-10 text-slate-500 group-hover:text-cyan-400 transition-colors relative z-10" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter shimmer-text">No Proposals Found</h3>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              We couldn't find any initiatives matching your criteria. Try widening your search or check back later!
            </p>
            <Button 
                variant="outline" 
                className="mt-10 rounded-full px-8 h-12 border-white/10 hover:bg-white/5 hover:border-cyan-500/30 transition-all font-bold"
                onClick={() => {setSearch(''); setFilter('ALL');}}
            >
                Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
