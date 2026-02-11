import { Proposal } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AI_URL = import.meta.env.VITE_AI_URL || 'http://localhost:3000';


export const api = {
  // Proposals
  getProposals: async (): Promise<Proposal[]> => {
    try {
      const res = await fetch(`${API_URL}/proposals`);
      if (!res.ok) throw new Error('Failed to fetch proposals');
      return res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  createProposal: async (data: any) => {
    const res = await fetch(`${API_URL}/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create proposal');
    return res.json();
  },

  // Votes
  voteProposal: async (proposalId: string, voterWallet: string) => {
    const res = await fetch(`${API_URL}/votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal_id: proposalId, voter_wallet: voterWallet }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to vote');
    return json;
  },

  // User
  getUserData: async (wallet: string): Promise<{ role: string, votes: string[] }> => {
    try {
      const res = await fetch(`${API_URL}/users/${wallet}`);
      if (!res.ok) return { role: 'VOTER', votes: [] };
      return res.json();
    } catch (e) {
      return { role: 'VOTER', votes: [] };
    }
  },

  getNotifications: async (wallet: string) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${wallet}`);
      if (!res.ok) return [];
      return res.json();
    } catch (e) {
      return [];
    }
  },

  // AI Services
  analyzeProposal: async (data: { title: string, description: string, amount: number }) => {
    try {
      const res = await fetch(`${AI_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('AI Analysis failed');
      return res.json();
    } catch (e) {
      console.error(e);
      return { score: 0, suggestions: ['AI Service is currently unavailable.'] };
    }
  },

  getProposalComparison: async (data: { title: string, description: string, amount: string }) => {
    try {
      const res = await fetch(`${AI_URL}/api/ai/proposal-comparison`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('AI Comparison failed');
      return res.json();
    } catch (e) {
      console.error(e);
      return { insight: 'Comparison data unavailable.', confidence: 0 };
    }
  }
};
