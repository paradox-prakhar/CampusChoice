const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all proposals
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM proposals';
    let params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching proposals' });
  }
});

// POST create proposal
router.post('/', async (req, res) => {
  const { title, description, proposer_wallet, tags } = req.body;
  
  if (!title || !description || !proposer_wallet) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Ensure user exists (in real app, user is created on connect)
    await db.query(`
      INSERT INTO users (wallet, role) VALUES ($1, 'PROPOSER')
      ON CONFLICT (wallet) DO UPDATE SET role = 'PROPOSER'
    `, [proposer_wallet]);

    const { rows } = await db.query(
      `INSERT INTO proposals (title, description, proposer_wallet, tags, status, vote_end, amount, recipient, duration, voting_model)
       VALUES ($1, $2, $3, $4, 'VOTING', NOW() + INTERVAL '2 minutes', $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, description, proposer_wallet, tags || [], req.body.amount, req.body.recipient, req.body.duration, req.body.voting_model, req.body.venue, req.body.host]
    );
    
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating proposal' });
  }
});

// GET single proposal
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM proposals WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Proposal not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
