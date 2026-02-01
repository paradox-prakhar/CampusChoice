const express = require('express');
const router = express.Router();
const db = require('../db');

// POST cast vote
router.post('/', async (req, res) => {
  const { proposal_id, voter_wallet } = req.body;

  if (!proposal_id || !voter_wallet) {
    return res.status(400).json({ error: 'Missing proposal_id or voter_wallet' });
  }

  try {
    // 1. Check if already voted
    const checkVote = await db.query(
      'SELECT * FROM votes WHERE proposal_id = $1 AND voter_wallet = $2',
      [proposal_id, voter_wallet]
    );

    if (checkVote.rows.length > 0) {
      return res.status(400).json({ error: 'User has already voted on this proposal' });
    }

    // 1.5 Check if proposal expired
    const props = await db.query('SELECT * FROM proposals WHERE id = $1', [proposal_id]);
    if (props.rows.length === 0) return res.status(404).json({ error: 'Proposal not found' });
    const proposal = props.rows[0];
    if (new Date() > new Date(proposal.vote_end)) {
        return res.status(400).json({ error: 'Voting period has ended' });
    }

    // 2. Insert vote
    await db.query(
      'INSERT INTO votes (proposal_id, voter_wallet) VALUES ($1, $2)',
      [proposal_id, voter_wallet]
    );

    // 3. Update proposal count
    const { rows } = await db.query(
      'UPDATE proposals SET vote_count = vote_count + 1 WHERE id = $1 RETURNING *',
      [proposal_id]
    );

    // 4. Ensure user exists as at least a VOTER
    await db.query(`
      INSERT INTO users (wallet, role) VALUES ($1, 'VOTER')
      ON CONFLICT (wallet) DO NOTHING
    `, [voter_wallet]);

    res.json({ message: 'Vote cast successfully', proposal: rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error casting vote' });
  }
});

module.exports = router;
