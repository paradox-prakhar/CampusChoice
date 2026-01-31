import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Send, Sparkles, Coins, Clock, Info } from 'lucide-react';

const ProposalForm = ({ daoContract, voteTokenContract, signer, address }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        recipient: '',
        duration: '3600', // Default 1 hour
        votingType: '0' // 0 = Weighted, 1 = Quadratic
    });
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);
    const [userBalance, setUserBalance] = useState("0");

    useEffect(() => {
        const fetchConfig = async () => {
            if (daoContract?.config) {
                const c = await daoContract.config();
                setConfig(c);
            }
            if (voteTokenContract && address) {
                const b = await voteTokenContract.balanceOf(address);
                setUserBalance(ethers.formatEther(b));
            }
        };
        fetchConfig();
    }, [daoContract, voteTokenContract, address, loading]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            setAiAnalysis(data);
        } catch (error) {
            console.error("AI Error:", error);
            alert("AI Service unavailable");
        }
        setLoading(false);
    };

    const handleMint = async () => {
        if (!voteTokenContract) return;
        await voteTokenContract.mint(address, BigInt(100 * 1e18));
        alert("Minted 100 Mock Tokens!");
        const b = await voteTokenContract.balanceOf(address);
        setUserBalance(ethers.formatEther(b));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!daoContract) return alert("Contract not initialized");

        try {
            const amountWei = ethers.parseEther(formData.amount);
            const ipfsData = JSON.stringify({ title: formData.title, description: formData.description });

            const tx = await daoContract.createProposal(
                ipfsData,
                amountWei,
                formData.recipient,
                parseInt(formData.duration),
                parseInt(formData.votingType),
                config ? config.proposalFee : BigInt(0)
            );
            await tx.wait();
            // Assuming onNotification is not passed here but we can use alert for now or updated App logic
            // Ideally we should pass a notification handler down or use context
            alert("Proposal submitted!");
            setFormData({ title: '', description: '', amount: '', recipient: '', duration: '3600', votingType: '0' });
            setAiAnalysis(null);
        } catch (error) {
            console.error(error);
            alert("Submission failed: " + error.message);
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-xl">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        Create Proposal
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Submit a new event for community funding</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-400 mb-2">
                        Gov Token Balance: <span className="text-white font-mono font-medium">{parseFloat(userBalance).toFixed(1)}</span>
                    </div>
                    <button
                        onClick={handleMint}
                        className="text-xs px-3 py-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 transition-colors flex items-center gap-1 ml-auto"
                    >
                        <Coins size={12} /> Mint Mock Tokens
                    </button>
                </div>
            </div>

            {config && (
                <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-3">
                    <Info className="text-orange-400 mt-0.5" size={18} />
                    <div className="text-sm text-orange-200/80">
                        <strong>Requirements:</strong> Min {parseFloat(ethers.formatEther(config.minTokensToPropose.toString()))} Tokens to propose.
                        <br />
                        Fee: {ethers.formatEther(config.proposalFee.toString())} ETH (Refundable).
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Event Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g., Annual Hackathon 2026"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                        name="description"
                        placeholder="Detailed description of the event..."
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Request Amount (ETH)</label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="0.0"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Recipient Address</label>
                        <input
                            type="text"
                            name="recipient"
                            placeholder="0x..."
                            value={formData.recipient}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <Clock size={14} /> Duration (Seconds)
                        </label>
                        <input
                            type="number"
                            name="duration"
                            placeholder="3600"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Voting Model</label>
                        <select
                            name="votingType"
                            value={formData.votingType}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none appearance-none"
                        >
                            <option value="0">Token Weighted (1 Token = 1 Vote)</option>
                            <option value="1">Quadratic (Power = √Tokens)</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-slate-600"
                    >
                        <Sparkles size={18} className="text-purple-400" />
                        {loading ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
                    <button
                        type="submit"
                        disabled={!signer}
                        className="flex-[2] px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} /> Submit Proposal
                    </button>
                </div>
            </form>

            {aiAnalysis && (
                <div className="mt-8 p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-xl animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${aiAnalysis.score > 70 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">AI Feasibility Score: {aiAnalysis.score}/100</h3>
                            <span className="text-xs text-slate-400">{aiAnalysis.score > 70 ? 'Strong Candidate' : 'Needs revisions'}</span>
                        </div>
                    </div>
                    <ul className="space-y-2">
                        {aiAnalysis.suggestions.map((s, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span> {s}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProposalForm;
