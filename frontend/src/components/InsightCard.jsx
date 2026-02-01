import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, AlertCircle } from 'lucide-react';

const InsightCard = ({ contract, proposalId, details }) => {
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInsight = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/api/ai/proposal-comparison', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: details?.title || `Proposal #${proposalId}`,
                    description: details?.description || "",
                    amount: details?.amount || "0"
                })
            });

            if (!response.ok) {
                throw new Error('AI service unavailable');
            }

            const data = await response.json();
            setInsight(data.insight);
        } catch (err) {
            console.warn("AI service connection failed:", err.message);
            setError("AI insights temporarily unavailable");
            // Don't crash - just show error message
        } finally {
            setLoading(false);
        }
    };

    if (!insight && !loading && !error) {
        return (
            <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-4 flex flex-col items-center gap-3 text-center">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white mb-1">AI Voter Insight</h4>
                    <p className="text-xs text-slate-400">Compare this event budget & scope with historical DAO data.</p>
                </div>
                <button
                    onClick={fetchInsight}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
                >
                    Generate Analysis
                </button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-center">
                <AlertCircle className="mx-auto mb-2 text-slate-500" size={20} />
                <p className="text-xs text-slate-400">{error}</p>
                <button
                    onClick={fetchInsight}
                    className="mt-2 text-xs text-indigo-400 hover:text-indigo-300"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>

            <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-purple-400 fill-purple-400" />
                <h4 className="text-xs font-black text-purple-300 uppercase tracking-widest">AI Comparison Insight</h4>
            </div>

            {loading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-3 bg-indigo-500/20 rounded w-3/4"></div>
                    <div className="h-3 bg-indigo-500/20 rounded w-5/6"></div>
                    <div className="h-3 bg-indigo-500/20 rounded w-1/2"></div>
                </div>
            ) : (
                <p className="text-sm text-indigo-100/90 leading-relaxed italic">
                    "{insight}"
                </p>
            )}

            {!loading && (
                <div className="mt-4 pt-3 border-t border-indigo-500/20 flex justify-between items-center">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                        <AlertCircle size={10} /> Verified by VibeAI
                    </span>
                    <button onClick={fetchInsight} className="text-[10px] text-slate-500 hover:text-white transition-colors">
                        Refresh
                    </button>
                </div>
            )}
        </div>
    );
};

export default InsightCard;
