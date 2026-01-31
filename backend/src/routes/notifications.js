const express = require('express');
const router = express.Router();
const db = require('../db');

// GET notifications for a wallet
router.get('/:wallet', async (req, res) => {
  const { wallet } = req.params;
  try {
    const { rows } = await db.query(
      'SELECT * FROM notifications WHERE wallet = $1 ORDER BY created_at DESC',
      [wallet]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.json([]); // Return empty on error to avoid breaking frontend
  }
});

module.exports = router;
