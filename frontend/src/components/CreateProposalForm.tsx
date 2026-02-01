import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { Rocket, Sparkles, Link as LinkIcon, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { api } from '../services/api';

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

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    score: number;
    suggestions: string[];
    insight: string;
    matchType: string;
  } | null>(null);

  const handleAIAnalysis = async () => {
    if (!formData.title || !formData.description || !formData.amount) {
      alert("Please fill in the title, description, and amount first.");
      return;
    }

    setAiLoading(true);
    try {
      const [analysis, comparison] = await Promise.all([
        api.analyzeProposal({
            title: formData.title,
            description: formData.description,
            amount: Number(formData.amount)
        }),
        api.getProposalComparison({
            title: formData.title,
            description: formData.description,
            amount: formData.amount
        })
      ]);

      setAiResult({
        score: analysis.score,
        suggestions: analysis.suggestions,
        insight: comparison.insight,
        matchType: comparison.matchType
      });
    } catch (e) {
      console.error("AI Analysis failed", e);
    } finally {
      setAiLoading(false);
    }
  };

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

      <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-xl mb-6">
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
                <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-300"
                    onClick={handleAIAnalysis}
                    isLoading={aiLoading}
                >
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

      {aiResult && (
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">AI Analysis Insights</h3>
                    <p className="text-xs text-slate-400">Powered by Campus Intelligence</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Quality Score</div>
                    <div className="text-3xl font-bold text-white mb-2">{aiResult.score}%</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ${aiResult.score > 70 ? 'bg-green-500' : aiResult.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${aiResult.score}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30 col-span-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">
                        <TrendingUp className="w-3 h-3 text-indigo-400" />
                        Market Comparison
                    </div>
                    <p className="text-sm text-slate-200 font-medium">{aiResult.insight}</p>
                    <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                        <Info className="w-2.5 h-2.5" />
                        Matched with historical {aiResult.matchType} data
                    </div>
                </div>
            </div>

            {aiResult.suggestions.length > 0 && (
                <div className="space-y-3">
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Suggestions for Improvement</div>
                    {aiResult.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                            <p className="text-sm text-slate-300 leading-relaxed">{suggestion}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
}
