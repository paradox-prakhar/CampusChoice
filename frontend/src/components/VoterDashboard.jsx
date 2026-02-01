import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TreasuryCharts from './TreasuryCharts';
import ProposalTimeline from './ProposalTimeline';
import { ChefHat, ExternalLink, ThumbsUp, ThumbsDown, Zap } from 'lucide-react';

const VoterDashboard = ({ daoContract, voteTokenContract, address, signer, onNotification }) => {
    const [proposals, setProposals] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [insights, setInsights] = useState({});
    const [loadingInsights, setLoadingInsights] = useState({});
    const [voteInputs, setVoteInputs] = useState({});

    const fetchProposals = async () => {
        if (!daoContract) return;
        try {
            const countBN = await daoContract.getProposalsCount();
            const countInt = Number(countBN);
            const loaded = [];
            for (let i = 0; i < countInt; i++) {
                const p = await daoContract.proposals(i);
                let details = { title: "Proposal #" + i, description: "" };
                try { details = JSON.parse(p.ipfsHash); } catch (e) { details.description = p.ipfsHash; }

                // Mock Timestamps for Timeline
                const now = Date.now();
                const deadline = Number(p.deadline) * 1000;
                const submittedAt = deadline - (7 * 24 * 60 * 60 * 1000); // Mock 7 days ago

                let currentStage = 'SUBMITTED';
                if (!p.executed && deadline > now) currentStage = 'VOTING';
                if (!p.executed && deadline <= now) currentStage = 'EXECUTED'; 
                // Note: Simplified logic as requested. If expired, move to Executed/Ended view.
                if (p.executed) currentStage = 'EXECUTED';

                loaded.push({
                    id: i,
                    ...details,
                    amount: ethers.formatEther(p.amount),
                    recipient: p.recipient,
                    deadline: new Date(deadline),
                    executed: p.executed,
                    yesVotes: ethers.formatEther(p.yesVotes),
                    noVotes: ethers.formatEther(p.noVotes),
                    votingType: p.votingType,
                    currentStage,
                    timestamps: {
                        submittedAt,
                        votingStartedAt: submittedAt + 3600000,
                        approvedAt: deadline,
                        executedAt: p.executed ? Date.now() : null
                    }
                });
            }
            setProposals(loaded);
            if (selectedId === null && loaded.length > 0) setSelectedId(loaded[0].id);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchProposals();
    }, [daoContract]);

    const fetchInsight = async (proposalId, p) => {
        if (insights[proposalId]) return;
        setLoadingInsights(prev => ({ ...prev, [proposalId]: true }));
        try {
            const res = await fetch('http://localhost:3000/api/ai/proposal-comparison', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: p.title, description: p.description, amount: p.amount })
            });
            const data = await res.json();
            setInsights(prev => ({ ...prev, [proposalId]: data.insight }));
        } catch (err) {
            setInsights(prev => ({ ...prev, [proposalId]: "Comparison unavailable." }));
        }
        setLoadingInsights(prev => ({ ...prev, [proposalId]: false }));
    };

    const handleVote = async (id, support, votingType) => {
        if (!daoContract) return;
        try {
            let tokenAmount = "0";
            if (votingType == 1) {
                const input = voteInputs[id];
                if (!input || parseFloat(input) <= 0) return alert("Enter tokens to commit!");
                tokenAmount = ethers.parseEther(input.toString());
            }
            const tx = await daoContract.vote(id, support, tokenAmount);
            await tx.wait();
            if (onNotification) onNotification("Vote recorded successfully! 🎉");
            await fetchProposals();
        } catch (err) { alert("Vote failed: " + err.message); }
    };

    const handleExecute = async (id) => {
        if (!daoContract) return;
        try {
            const tx = await daoContract.execute(id);
            await tx.wait();
            if (onNotification) onNotification("Proposal Executed! Funds Released. 🚀");
            await fetchProposals();
        } catch (err) { alert("Execution failed: " + err.message); }
    };

    const selectedProposal = proposals.find(p => p.id === selectedId);

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="mb-6">
                <TreasuryCharts daoContract={daoContract} />
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Sidebar List */}
                <div className="w-1/3 overflow-y-auto pr-2 space-y-4">
                    <h3 className="text-slate-400 font-semibold mb-2 uppercase text-xs tracking-wider">Proposals</h3>
                    {proposals.map(p => (
                        <div
                            key={p.id}
                            onClick={() => setSelectedId(p.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedId === p.id
                                ? 'bg-indigo-900/20 border-indigo-500 shadow-indigo-500/10 shadow-lg'
                                : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${p.currentStage === 'EXECUTED' ? 'bg-green-500/10 text-green-400' :
                                        p.currentStage === 'VOTING' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-700 text-slate-400'
                                    }`}>
                                    {p.currentStage}
                                </span>
                                <span className="text-xs text-slate-500">#{p.id}</span>
                            </div>
                            <h4 className="font-semibold text-slate-100 mb-1 truncate">{p.title}</h4>
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>{p.amount} ETH</span>
                                <span>{p.votingType == 1 ? '⚡ Quadratic' : '⚖️ Weighted'}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail Panel */}
                <div className="w-2/3 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 overflow-y-auto shadow-2xl">
                    {selectedProposal ? (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{selectedProposal.title}</h2>
                                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                                        <span className="flex items-center gap-1">
                                            <ExternalLink size={14} /> To: {selectedProposal.recipient.slice(0, 6)}...
                                        </span>
                                        <span>•</span>
                                        <span>Request: <span className="text-white font-medium">{selectedProposal.amount} ETH</span></span>
                                        {selectedProposal.venue && (
                                            <>
                                                <span>•</span>
                                                <span className="text-slate-400">📍 {selectedProposal.venue}</span>
                                            </>
                                        )}
                                        {selectedProposal.host && (
                                            <>
                                                <span>•</span>
                                                <span className="text-slate-400">🎤 {selectedProposal.host}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {selectedProposal.currentStage === 'VOTING' && (
                                    <div className="text-right">
                                        <div className="text-indigo-400 font-semibold">Voting Active</div>
                                        <div className="text-xs text-slate-500">Ends {selectedProposal.deadline.toLocaleDateString()}</div>
                                    </div>
                                )}
                            </div>

                            <ProposalTimeline currentStage={selectedProposal.currentStage} timestamps={selectedProposal.timestamps} />

                            <div className="grid grid-cols-3 gap-4 my-8">
                                <div className="col-span-2 space-y-6">
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                        <h4 className="font-semibold text-slate-300 mb-2">Description</h4>
                                        <p className="text-slate-400 leading-relaxed">{selectedProposal.description || "No description provided."}</p>
                                    </div>

                                    {/* AI Insight */}
                                    <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                                                <Zap size={18} />
                                                <span>AI Context (Voter Only)</span>
                                            </div>
                                            {!insights[selectedProposal.id] && (
                                                <button
                                                    onClick={() => fetchInsight(selectedProposal.id, selectedProposal)}
                                                    disabled={loadingInsights[selectedProposal.id]}
                                                    className="text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-lg transition-colors"
                                                >
                                                    {loadingInsights[selectedProposal.id] ? 'Analyzing...' : 'Load Insight'}
                                                </button>
                                            )}
                                        </div>
                                        {insights[selectedProposal.id] ? (
                                            <p className="text-indigo-100/80 italic text-sm border-l-2 border-indigo-500 pl-3">
                                                "{insights[selectedProposal.id]}"
                                            </p>
                                        ) : (
                                            <p className="text-slate-500 text-sm">Click to view AI analysis of this proposal compared to historical data.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Voting Panel */}
                                <div className="col-span-1 space-y-4">
                                    <div className="bg-slate-700/20 p-4 rounded-xl border border-slate-700">
                                        <div className="flex justify-between mb-4 text-sm font-medium">
                                            <span className="text-green-400">Yes: {parseFloat(selectedProposal.yesVotes).toFixed(1)}</span>
                                            <span className="text-red-400">No: {parseFloat(selectedProposal.noVotes).toFixed(1)}</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden flex mb-6">
                                            <div style={{ width: `${(parseFloat(selectedProposal.yesVotes) / (parseFloat(selectedProposal.yesVotes) + parseFloat(selectedProposal.noVotes) || 1)) * 100}%` }} className="bg-green-500" />
                                            <div style={{ width: `${(parseFloat(selectedProposal.noVotes) / (parseFloat(selectedProposal.yesVotes) + parseFloat(selectedProposal.noVotes) || 1)) * 100}%` }} className="bg-red-500" />
                                        </div>

                                        {selectedProposal.currentStage === 'VOTING' && (
                                            <div className="space-y-3">
                                                {selectedProposal.votingType == 1 && (
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1">Quadratic Commitment</label>
                                                        <input
                                                            type="number"
                                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                                            placeholder="Tokens"
                                                            onChange={(e) => setVoteInputs(prev => ({ ...prev, [selectedProposal.id]: e.target.value }))}
                                                        />
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => handleVote(selectedProposal.id, true, selectedProposal.votingType)}
                                                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        <ThumbsUp size={16} /> Yes
                                                    </button>
                                                    <button
                                                        onClick={() => handleVote(selectedProposal.id, false, selectedProposal.votingType)}
                                                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        <ThumbsDown size={16} /> No
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {!selectedProposal.executed && selectedProposal.yesVotes > selectedProposal.noVotes && selectedProposal.deadline <= new Date() && (
                                            <button
                                                onClick={() => handleExecute(selectedProposal.id)}
                                                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                                            >
                                                Execute Proposal
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-500">
                            Select a proposal to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoterDashboard;
