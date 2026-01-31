import React, { useState } from 'react';
import { ethers } from 'ethers';

const ProposalForm = ({ daoContract, voteTokenContract, signer }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        recipient: '',
        duration: '3600' // Default 1 hour
    });
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

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
                parseInt(formData.duration)
            );
            await tx.wait();
            alert("Proposal submitted!");
            setFormData({ title: '', description: '', amount: '', recipient: '', duration: '3600' });
            setAiAnalysis(null);
        } catch (error) {
            console.error(error);
            alert("Submission failed: " + error.message);
        }
    };

    return (
        <div className="card">
            <h2>Create Proposal</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" rows="4" value={formData.description} onChange={handleChange} required />
                <div className="flex-row" style={{ gap: '1rem' }}>
                    <input type="number" name="amount" placeholder="Amount (ETH)" value={formData.amount} onChange={handleChange} required />
                    <input type="text" name="recipient" placeholder="Recipient Address" value={formData.recipient} onChange={handleChange} required />
                </div>
                <input type="number" name="duration" placeholder="Duration (seconds)" value={formData.duration} onChange={handleChange} required />

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
