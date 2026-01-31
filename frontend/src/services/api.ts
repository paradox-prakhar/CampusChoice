import { Proposal } from '../types';

const API_URL = 'http://localhost:3001';

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
  }
};
