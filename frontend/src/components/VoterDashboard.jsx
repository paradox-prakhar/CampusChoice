import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const VoterDashboard = ({ daoContract, voteTokenContract, address, signer }) => {
    const [proposals, setProposals] = useState([]);
    const [insights, setInsights] = useState({}); // Map proposalId -> insight text
    const [loadingInsights, setLoadingInsights] = useState({});

    useEffect(() => {
        const fetchProposals = async () => {
            if (!daoContract) return;
            try {
                const countBN = await daoContract.getProposalsCount();
                const countInt = Number(countBN);
                const loaded = [];
                for (let i = 0; i < countInt; i++) {
                    const p = await daoContract.proposals(i);
                    // Only show ACTIVE proposals for voting dashboard usually, but we show all for MVP demo
                    let details = { title: "Proposal #" + i, description: "" };
                    try { details = JSON.parse(p.ipfsHash); } catch (e) { details.description = p.ipfsHash; }

                    loaded.push({
                        id: i,
                        ...details,
                        amount: ethers.formatEther(p.amount),
                        recipient: p.recipient,
                        deadline: new Date(Number(p.deadline) * 1000),
                        executed: p.executed,
                        yesVotes: ethers.formatEther(p.yesVotes),
                        noVotes: ethers.formatEther(p.noVotes),
                    });
                }
                setProposals(loaded);
            } catch (err) { console.error(err); }
        }
        fetchProposals();
    }, [daoContract]);

    const fetchInsight = async (proposalId, p) => {
        if (insights[proposalId]) return; // already fetched

        setLoadingInsights(prev => ({ ...prev, [proposalId]: true }));
        try {
            const res = await fetch('http://localhost:3000/api/ai/proposal-comparison', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: p.title,
                    description: p.description,
                    amount: p.amount
                })
            });
            const data = await res.json();
            setInsights(prev => ({ ...prev, [proposalId]: data.insight }));
        } catch (err) {
            console.error("AI Error", err);
            setInsights(prev => ({ ...prev, [proposalId]: "Comparison unavailable." }));
        }
        setLoadingInsights(prev => ({ ...prev, [proposalId]: false }));
    };

    const [voteInputs, setVoteInputs] = useState({});

    const handleVote = async (id, support, votingType) => {
        if (!daoContract) return;
        try {
            let tokenAmount = "0";
            if (votingType == 1) { // Quadratic
                const input = voteInputs[id];
                if (!input || parseFloat(input) <= 0) return alert("Please enter token amount to commit!");
                tokenAmount = ethers.parseEther(input.toString());
            }

            const tx = await daoContract.vote(id, support, tokenAmount);
            await tx.wait();
            alert("Voted!");
            // Refresh? The effect runs on daoContract change, we might need manual refresh or depend on events.
            // For mock, just force re-render? or call fetchProposals.
            // Ideally we should move fetchProposals directly into function scope or useRefresh.
            window.location.reload(); // Simple refresh for MVP
        } catch (err) {
            alert("Vote failed: " + err.message);
        }
    };

    const handleExecute = async (id) => {
        if (!daoContract) return;
        try {
            const tx = await daoContract.execute(id);
            await tx.wait();
            alert("Executed!");
            window.location.reload();
        } catch (err) {
            alert("Execution failed: " + err.message);
        }
    };

    const activeProposals = proposals.filter(p => !p.executed && p.deadline > new Date());
    const pastProposals = proposals.filter(p => p.executed || p.deadline <= new Date());

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Voter Insights Dashboard</h2>
            <p style={{ color: 'var(--color-text-dim)' }}>AI-Powered decision support for active governance.</p>

            <div style={{ marginTop: '2rem' }}>
                <h3>🗳️ Active Proposals ({activeProposals.length})</h3>
                {activeProposals.length === 0 && <p>No active proposals to vote on.</p>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '1rem' }}>
                    {activeProposals.map(p => (
                        <div key={p.id} className="card" style={{ border: '1px solid var(--color-surface)', position: 'relative' }}>
                            <div className="flex-row">
                                <div>
                                    <h4 style={{ margin: 0 }}>{p.title}</h4>
                                    <span style={{ fontSize: '0.7em', padding: '2px 8px', border: '1px solid var(--color-primary)', borderRadius: '4px', display: 'inline-block', marginTop: '5px' }}>
                                        {p.votingType == 1 ? "⚡ Quadratic" : "⚖️ Weighted"}
                                    </span>
                                </div>
                                <span className={p.executed ? "badge badge-green" : "badge"}>
                                    {p.executed ? "Executed" : "Active"}
                                </span>
                            </div>

                            <div style={{ fontSize: '0.9em', color: 'var(--color-text-dim)', marginBottom: '10px', marginTop: '10px' }}>
                                <div>Request: {p.amount} ETH</div>
                                <div>To: {p.recipient.slice(0, 6)}...</div>
                            </div>

                            {/* AI Context Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                                border: '1px dashed var(--color-primary)',
                                borderRadius: '8px',
                                padding: '10px',
                                marginTop: '10px',
                                fontSize: '0.9em'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <strong style={{ color: '#a5b4fc' }}>🤖 AI Context</strong>
                                    {insights[p.id] ? (
                                        <span style={{ fontSize: '0.8em', color: '#86efac' }}>Updated</span>
                                    ) : (
                                        <button
                                            onClick={() => fetchInsight(p.id, p)}
                                            style={{ padding: '2px 8px', fontSize: '0.8em', background: 'rgba(255,255,255,0.1)' }}
                                            disabled={loadingInsights[p.id]}
                                        >
                                            {loadingInsights[p.id] ? 'Analyzing...' : 'Show Insight'}
                                        </button>
                                    )}
                                </div>

                                {insights[p.id] ? (
                                    <p style={{ margin: 0, fontStyle: 'italic' }}>{insights[p.id]}</p>
                                ) : (
                                    <p style={{ margin: 0, color: 'var(--color-text-dim)', fontSize: '0.85em' }}>
                                        Click to compare this proposal against {p.amount} ETH historical averages.
                                    </p>
                                )}
                            </div>

                            <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', marginBottom: '5px' }}>
                                    <span>Current Status:</span>
                                    <span>Yes: {parseFloat(p.yesVotes).toFixed(1)} | No: {parseFloat(p.noVotes).toFixed(1)}</span>
                                </div>

                                <div style={{ height: '6px', background: '#333', borderRadius: '3px', marginTop: '5px', overflow: 'hidden', display: 'flex' }}>
                                    <div style={{ width: `${(parseFloat(p.yesVotes) / (parseFloat(p.yesVotes) + parseFloat(p.noVotes) || 1)) * 100}%`, background: 'var(--color-success)' }}></div>
                                    <div style={{ width: `${(parseFloat(p.noVotes) / (parseFloat(p.yesVotes) + parseFloat(p.noVotes) || 1)) * 100}%`, background: 'var(--color-danger)' }}></div>
                                </div>

                                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {p.votingType == 1 && !p.executed && (
                                        <div style={{ flex: 1 }}>
                                            <input
                                                type="number"
                                                placeholder="Tokens to Commit"
                                                onChange={(e) => setVoteInputs({ ...voteInputs, [p.id]: e.target.value })}
                                                style={{ width: '100%', padding: '8px', marginBottom: '5px', fontSize: '0.9em' }}
                                            />
                                            <small style={{ color: 'var(--color-primary)' }}>
                                                Power: {voteInputs[p.id] ? Math.sqrt(parseFloat(voteInputs[p.id])).toFixed(2) : '0'}
                                            </small>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleVote(p.id, true, p.votingType)} disabled={p.executed} style={{ flex: 1 }}>Vote YES</button>
                                        <button onClick={() => handleVote(p.id, false, p.votingType)} disabled={p.executed} style={{ flex: 1, background: 'var(--color-surface)' }}>Vote NO</button>
                                    </div>
                                    {!p.executed && (
                                        <button onClick={() => handleExecute(p.id)} style={{ width: '100%', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid #444' }}>Execute Proposal</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '3rem', opacity: 0.7 }}>
                <h3>📜 Past Decisions</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #444' }}>
                                <th style={{ padding: '10px' }}>Title</th>
                                <th style={{ padding: '10px' }}>Result</th>
                                <th style={{ padding: '10px' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastProposals.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '10px' }}>{p.title}</td>
                                    <td style={{ padding: '10px', color: p.executed ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                        {p.executed ? 'Passed & Executed' : 'Rejected / Pending'}
                                    </td>
                                    <td style={{ padding: '10px' }}>{p.amount} ETH</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VoterDashboard;
