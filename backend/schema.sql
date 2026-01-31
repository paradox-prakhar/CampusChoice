-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  wallet TEXT PRIMARY KEY,
  role TEXT DEFAULT 'VOTER',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Proposals Table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount TEXT,
  recipient TEXT,
  duration INT,
  voting_model TEXT DEFAULT 'TOKEN_WEIGHTED',
  proposer_wallet TEXT REFERENCES users(wallet),
  tags TEXT[],
  status TEXT DEFAULT 'DRAFT', -- DRAFT, VOTING, APPROVED, ARCHIVED
  vote_count INT DEFAULT 0,
  vote_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Votes Table (Composite Key ensures 1 vote per user per proposal)
CREATE TABLE IF NOT EXISTS votes (
  proposal_id UUID REFERENCES proposals(id),
  voter_wallet TEXT REFERENCES users(wallet),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (proposal_id, voter_wallet)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet TEXT REFERENCES users(wallet),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
