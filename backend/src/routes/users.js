const express = require('express');
const router = express.Router();
const db = require('../db');

// GET user info and votes
router.get('/:wallet', async (req, res) => {
  const { wallet } = req.params;

  try {
    // Get User Role
    const userRes = await db.query('SELECT * FROM users WHERE wallet = $1', [wallet]);
    const user = userRes.rows[0] || { wallet, role: 'VOTER' };

    // Get Vote History
    const votesRes = await db.query('SELECT proposal_id FROM votes WHERE voter_wallet = $1', [wallet]);
    const votedProposalIds = votesRes.rows.map(r => r.proposal_id);

    res.json({
      ...user,
      votes: votedProposalIds
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

module.exports = router;
