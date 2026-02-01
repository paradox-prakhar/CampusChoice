import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { Rocket, Sparkles, Link as LinkIcon, AlertCircle } from 'lucide-react';

export function CreateProposalForm() {
  const { createProposal, isLoading } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    recipient: '',
    duration: '3600',
    voting_model: 'TOKEN_WEIGHTED',
    tags: '',
    venue: '',
    host: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    await createProposal({
        title: formData.title,
        description: formData.description,
        amount: formData.amount,
        recipient: formData.recipient,
        duration: Number(formData.duration),
        voting_model: formData.voting_model,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        venue: formData.venue,
        host: formData.host
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
        {/* Header Section with Mint Button */}
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Create Proposal</h2>
                <p className="text-slate-400 text-sm">Submit a new event for community funding</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
                 <p className="text-xs text-slate-400">Gov Token Balance: <span className="text-white font-mono">300.0</span></p>
                 <Button variant="outline" size="sm" className="h-8 text-xs border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                    <LinkIcon className="w-3 h-3 mr-1" /> Mint Mock Tokens
                 </Button>
            </div>
        </div>

        {/* Warning Badge */}
        <div className="bg-orange-900/20 border border-orange-700/30 rounded-lg p-3 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-sm text-orange-200/80">
                <span className="font-semibold text-orange-200">Requirements:</span> Min 100 Tokens to propose.<br/>
                Fee: 0.01 ETH (Refundable).
            </div>
        </div>

      <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Event Title</label>
                <input 
                    type="text" 
                    placeholder="e.g. Annual Hackathon 2026"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea 
                    placeholder="Detailed description of the event..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-32 resize-none placeholder:text-slate-600"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Request Amount (ETH)</label>
                    <input 
                        type="number" 
                        placeholder="0.0"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                        value={formData.amount}
                        onChange={e => setFormData({...formData, amount: e.target.value})}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Recipient Address</label>
                    <input 
                        type="text" 
                        placeholder="0x..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                        value={formData.recipient}
                        onChange={e => setFormData({...formData, recipient: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Venue</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Main Auditorium"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                        value={formData.venue}
                        onChange={e => setFormData({...formData, venue: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Host / Organizer</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Student Council"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                        value={formData.host}
                        onChange={e => setFormData({...formData, host: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Duration (Seconds)</label>
                    <input 
                        type="number" 
                        placeholder="3600"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                        value={formData.duration}
                        onChange={e => setFormData({...formData, duration: e.target.value})}
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Voting Model</label>
                    <select 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                        value={formData.voting_model}
                        onChange={e => setFormData({...formData, voting_model: e.target.value})}
                    >
                        <option value="TOKEN_WEIGHTED">Token Weighted (1 Token = 1 Vote)</option>
                        <option value="QUADRATIC">Quadratic Voting</option>
                    </select>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50 flex gap-4">
                <Button type="button" variant="outline" className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-300">
                    <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
                    Analyze with AI
                </Button>
                
                <Button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white" isLoading={isLoading}>
                    <Rocket className="w-4 h-4 mr-2" />
                    Submit Proposal
                </Button>
            </div>
          </form>
      </div>
    </div>
  );
}
