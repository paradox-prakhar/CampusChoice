import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const ProposalList = ({ daoContract, voteTokenContract, signer, address }) => {
    const [proposals, setProposals] = useState([]);
    const [voteInputs, setVoteInputs] = useState({}); // Store token input for quadratic voting

    const fetchProposals = async () => {
        if (!daoContract) return;
        try {
            // This is inefficient loop for production but fine for MVP
            const count = 0; // await daoContract.getProposalsCount(); -> assuming I added this or use internal array length logic if possible. 
            // Better: loop until error or known count.
            // Let's assume passed contract has a getter for array length or we just fetch first 10.

            // Wait, I added getProposalsCount() to my solidity code? 
            // Let's check. Yes: "function getProposalsCount() external view returns (uint256)"
            const countBN = await daoContract.getProposalsCount();
            const countInt = Number(countBN); // safe for small numbers

            const loaded = [];
            for (let i = 0; i < countInt; i++) {
                const p = await daoContract.proposals(i);
                // p is structure: [ipfsHash, amount, recipient, yesVotes, noVotes, deadline, executed]
                let details = { title: "Proposal #" + i, description: p.ipfsHash };
                try {
                    details = JSON.parse(p.ipfsHash);
                } catch (e) { }

                loaded.push({
                    id: i,
                    ...details,
                    amount: ethers.formatEther(p.amount),
                    recipient: p.recipient,
                    yesVotes: ethers.formatEther(p.yesVotes), // Assuming votes are weighted by token decimals
                    noVotes: ethers.formatEther(p.noVotes),
                    deadline: new Date(Number(p.deadline) * 1000),
                    executed: p.executed,
                    votingType: p.votingType, // 0 = Weighted, 1 = Quadratic
                    raw: p
                });
            }
            setProposals(loaded);
        } catch (err) {
            console.error("Error fetching proposals:", err);
        }
    };

    useEffect(() => {
        fetchProposals();
        const interval = setInterval(fetchProposals, 5000);
        return () => clearInterval(interval);
    }, [daoContract]);

    const handleVote = async (id, support, votingType) => {
        if (!daoContract) return;
        try {
            let tokenAmount = "0";
            if (votingType == 1) { // Quadratic
                const input = voteInputs[id];
                if (!input || parseFloat(input) <= 0) return alert("Please enter token amount to commit!");
                tokenAmount = ethers.parseEther(input.toString());
            }

            // In weighted, we just pass 0 or ignored param.
            // But mock expects it for Quadratic.

            const tx = await daoContract.vote(id, support, tokenAmount);
            await tx.wait();
            alert("Voted!");
            fetchProposals();
            setVoteInputs({ ...voteInputs, [id]: '' });
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
            fetchProposals();
        } catch (err) {
            alert("Execution failed: " + err.message);
        }
    };

    return (
        <div>
            <h2>Existing Proposals</h2>
            {proposals.length === 0 && <p>No proposals yet.</p>}
            {proposals.map(p => (
                <div key={p.id} className="card">
                    <div className="flex-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3>{p.title}</h3>
                            <span style={{ fontSize: '0.7em', padding: '2px 8px', border: '1px solid var(--color-primary)', borderRadius: '4px' }}>
                                {p.votingType == 1 ? "⚡ Quadratic" : "⚖️ Weighted"}
                            </span>
                        </div>
                        <span className={p.executed ? "badge badge-green" : "badge"}>
                            {p.executed ? "Executed" : (p.deadline < new Date() ? "Ended" : "Active")}
                        </span>
                    </div>
                    <p>{p.description}</p>
                    <div className="flex-row" style={{ fontSize: '0.9em', color: 'var(--color-text-dim)' }}>
                        <span>Req: {p.amount} ETH</span>
                        <span>To: {p.recipient.slice(0, 6)}...</span>
                        <span>Ends: {p.deadline.toLocaleString()}</span>
                    </div>

                    <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                        <div className="flex-row">
                            <span style={{ color: 'var(--color-success)' }}>Yes: {p.yesVotes}</span>
                            <span style={{ color: 'var(--color-danger)' }}>No: {p.noVotes}</span>
                        </div>
                        {/* Progress Bar */}
                        <div style={{ height: '6px', background: '#333', borderRadius: '3px', marginTop: '5px', overflow: 'hidden', display: 'flex' }}>
                            <div style={{ width: `${(parseFloat(p.yesVotes) / (parseFloat(p.yesVotes) + parseFloat(p.noVotes) || 1)) * 100}%`, background: 'var(--color-success)' }}></div>
                            <div style={{ width: `${(parseFloat(p.noVotes) / (parseFloat(p.yesVotes) + parseFloat(p.noVotes) || 1)) * 100}%`, background: 'var(--color-danger)' }}></div>
                        </div>
                    </div>

                    <div className="flex-row" style={{ marginTop: '1rem', gap: '10px', alignItems: 'flex-end' }}>
                        {p.votingType == 1 && !p.executed && p.deadline > new Date() && (
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8em', color: 'var(--color-text-dim)' }}>Tokens to Commit:</label>
                                <input
                                    type="number"
                                    placeholder="Ex: 100 Tokens"
                                    value={voteInputs[p.id] || ''}
                                    onChange={(e) => setVoteInputs({ ...voteInputs, [p.id]: e.target.value })}
                                    style={{ marginBottom: 0 }}
                                />
                                <div style={{ fontSize: '0.7em', color: 'var(--color-primary)' }}>
                                    Resulting Power: {voteInputs[p.id] ? Math.sqrt(parseFloat(voteInputs[p.id])).toFixed(2) : '0'}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleVote(p.id, true, p.votingType)} disabled={p.executed || p.deadline < new Date()}>Vote YES</button>
                            <button onClick={() => handleVote(p.id, false, p.votingType)} disabled={p.executed || p.deadline < new Date()} style={{ background: 'var(--color-surface)' }}>Vote NO</button>
                            {!p.executed && p.deadline < new Date() && (
                                <button onClick={() => handleExecute(p.id)}>Execute</button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProposalList;
