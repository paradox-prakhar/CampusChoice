export type UserRole = 'PROPOSER' | 'VOTER' | null;

export interface User {
  wallet: string;
  role: string;
  votes: string[]; // List of proposal IDs voted on
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  amount: string;
  recipient: string;
  duration: number; // seconds
  voting_model: 'TOKEN_WEIGHTED' | 'QUADRATIC';
  proposer_wallet: string;
  tags: string[];
  status: "DRAFT" | "SUBMITTED" | "VOTING" | "APPROVED" | "ARCHIVED";
  vote_count: number;
  vote_end: string; // ISO timestamp
  created_at: string;
}

export interface Vote {
  proposal_id: string;
  voter_wallet: string;
  created_at: string;
}
