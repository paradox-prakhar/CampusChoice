// In-memory storage (temporary solution until PostgreSQL is configured)
const storage = {
  users: new Map(),
  proposals: new Map(),
  votes: new Map(),
  notifications: new Map()
};

// Helper to generate UUID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = {
  query: async (text, params) => {
    // Simple query parser for in-memory storage
    const queryLower = text.toLowerCase().trim();

    // Handle INSERT INTO users
    if (queryLower.includes('insert into users')) {
      const wallet = params[0];
      const role = params[1] || 'VOTER';
      storage.users.set(wallet, { wallet, role, created_at: new Date().toISOString() });
      return { rows: [storage.users.get(wallet)] };
    }

    // Handle INSERT INTO proposals
    if (queryLower.includes('insert into proposals')) {
      const id = generateId();
      const proposal = {
        id,
        title: params[0],
        description: params[1],
        proposer_wallet: params[2],
        tags: params[3] || [],
        status: 'VOTING',
        vote_count: 0,
        // Set to 2 minutes for testing/demo purposes as requested
        vote_end: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
        amount: params[4] || '',
        recipient: params[5] || '',
        duration: params[6] || 0,
        voting_model: params[7] || 'TOKEN_WEIGHTED',
        venue: params[8] || '',
        host: params[9] || '',
        created_at: new Date().toISOString()
      };
      storage.proposals.set(id, proposal);
      return { rows: [proposal] };
    }

    // Handle SELECT * FROM proposals
    if (queryLower.includes('select * from proposals')) {
      const proposals = Array.from(storage.proposals.values());
      
      // Handle ID filter
      if (queryLower.includes('where id =')) {
         const id = params[0];
         return { rows: proposals.filter(p => p.id === id) };
      }

      // Handle status filter
      if (params && params[0]) {
        return { rows: proposals.filter(p => p.status === params[0]) };
      }
      return { rows: proposals };
    }

    // Handle SELECT * FROM users
    if (queryLower.includes('select * from users where wallet')) {
      const wallet = params[0];
      const user = storage.users.get(wallet);
      if (user) {
        // Get votes for this user
        const userVotes = Array.from(storage.votes.values())
          .filter(v => v.voter_wallet === wallet)
          .map(v => v.proposal_id);
        return { rows: [{ ...user, votes: userVotes }] };
      }
      return { rows: [] };
    }

    // Handle SELECT * FROM votes (check if already voted)
    if (queryLower.includes('select * from votes where')) {
      const proposal_id = params[0];
      const voter_wallet = params[1];
      const voteKey = `${proposal_id}_${voter_wallet}`;

      if (storage.votes.has(voteKey)) {
        return { rows: [storage.votes.get(voteKey)] };
      }
      return { rows: [] };
    }

    // Handle INSERT INTO votes
    if (queryLower.includes('insert into votes')) {
      const proposal_id = params[0];
      const voter_wallet = params[1];
      const voteKey = `${proposal_id}_${voter_wallet}`;

      // Check if already voted
      if (storage.votes.has(voteKey)) {
        throw new Error('Already voted');
      }

      storage.votes.set(voteKey, {
        proposal_id,
        voter_wallet,
        created_at: new Date().toISOString()
      });

      // Increment vote count
      const proposal = storage.proposals.get(proposal_id);
      if (proposal) {
        proposal.vote_count++;
        storage.proposals.set(proposal_id, proposal);
      }

      return { rows: [storage.votes.get(voteKey)] };
    }

    // Handle SELECT notifications
    if (queryLower.includes('select * from notifications')) {
      const wallet = params[0];
      const notifications = Array.from(storage.notifications.values())
        .filter(n => n.wallet === wallet);
      return { rows: notifications };
    }

    // Default empty response
    return { rows: [] };
  }
};
