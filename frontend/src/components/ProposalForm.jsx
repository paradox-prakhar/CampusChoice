import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

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
            if (daoContract && daoContract.config) {
                const c = await daoContract.config();
                setConfig(c);
            }
            if (voteTokenContract && address) {
                const b = await voteTokenContract.balanceOf(address);
                setUserBalance(ethers.formatEther(b));
            }
        };
        fetchConfig();
    }, [daoContract, voteTokenContract, address, loading]); // reload on submit (loading change)

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
            // Mocking IPFS: storing JSON string directly if short, or just description
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
            alert("Proposal submitted!");
            setFormData({ title: '', description: '', amount: '', recipient: '', duration: '3600', votingType: '0' });
            setAiAnalysis(null);
        } catch (error) {
            console.error(error);
            alert("Submission failed: " + error.message);
        }
    };

    return (
        <div className="card">
            <div className="flex-row">
                <h2>Create Proposal</h2>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9em' }}>Gov Token Balance: {parseFloat(userBalance).toFixed(1)}</div>
                    <button onClick={handleMint} style={{ padding: '2px 8px', fontSize: '0.8em', background: 'var(--color-primary)' }}>+ Mint Mock Tokens</button>
                </div>
            </div>

            {config && (
                <div style={{ marginBottom: '1rem', padding: '10px', background: 'rgba(255,165,0,0.1)', borderRadius: '8px', fontSize: '0.9em' }}>
                    <strong>Requirements:</strong> Min {parseFloat(ethers.formatEther(config.minTokensToPropose.toString()))} Tokens to propose.
                    Fee: {ethers.formatEther(config.proposalFee.toString())} ETH (Refundable).
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" rows="4" value={formData.description} onChange={handleChange} required />

                <div className="flex-row" style={{ gap: '1rem' }}>
                    <input type="number" name="amount" placeholder="Request Amount (ETH)" value={formData.amount} onChange={handleChange} required />
                    <input type="text" name="recipient" placeholder="Recipient Address" value={formData.recipient} onChange={handleChange} required />
                </div>

                <div className="flex-row" style={{ gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Duration (Seconds)</label>
                        <input type="number" name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} required />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Voting Model</label>
                        <select name="votingType" value={formData.votingType} onChange={handleChange} style={{ width: '100%', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--color-surface)', borderRadius: '8px' }}>
                            <option value="0">Token Weighted (1 Token = 1 Vote)</option>
                            <option value="1">Quadratic (Power = √Tokens)</option>
                        </select>
                    </div>
                </div>

                <div className="flex-row" style={{ marginTop: '1rem' }}>
                    <button type="button" onClick={handleAnalyze} disabled={loading} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-primary)' }}>
                        ✨ Analyze with AI
                    </button>
                    <button type="submit" disabled={!signer}>Submit Proposal</button>
                </div>
            </form>

            {aiAnalysis && (
                <div className="card" style={{ marginTop: '1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--color-primary)' }}>
                    <div className="flex-row">
                        <h3>AI Score: {aiAnalysis.score}/100</h3>
                        {aiAnalysis.score > 70 ? '✅ Strong' : '⚠️ Needs Improvement'}
                    </div>
                    <ul>
                        {aiAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProposalForm;
