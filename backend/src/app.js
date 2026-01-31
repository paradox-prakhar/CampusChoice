const express = require('express');
const cors = require('cors');
const proposalRoutes = require('./routes/proposals');
const voteRoutes = require('./routes/votes');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/proposals', proposalRoutes);
app.use('/votes', voteRoutes);
app.use('/users', userRoutes);
app.use('/notifications', notificationRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

module.exports = app;
