const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Mock AI Analysis Endpoint
app.post('/analyze', (req, res) => {
    const { title, description, amount } = req.body;

    // Simple rule-based scoring (Mocking AI)
    let score = 50;
    let suggestions = [];

    if (description.length > 50) score += 20;
    if (description.length > 100) score += 10;
    if (amount < 1000) score += 10;
    if (title.length > 5) score += 10;

    if (description.length < 50) suggestions.push("Description is too short. Add more details about the event impact.");
    if (amount > 10000) suggestions.push("Budget request is high. Provide a detailed breakdown.");
    if (title.length < 5) suggestions.push("Title is too short.");

    res.json({
        score: Math.min(score, 100),
        suggestions
    });
});

// Mock Historical Data
const HISTORICAL_DATA = [
    { type: 'workshop', avgBudget: 3000, avgAttendees: 50, semester: 'Fall 2024' },
    { type: 'hackathon', avgBudget: 15000, avgAttendees: 200, semester: 'Spring 2024' },
    { type: 'seminar', avgBudget: 1000, avgAttendees: 30, semester: 'Fall 2024' }
];

app.post('/api/ai/proposal-comparison', (req, res) => {
    const { title, amount, description } = req.body;
    const amountVal = parseFloat(amount);

    // Simple classification based on title/desc keywords
    const text = (title + " " + description).toLowerCase();
    let match = HISTORICAL_DATA.find(d => text.includes(d.type));

    if (!match) {
        // Default fallback if no keyword match
        match = { type: 'general event', avgBudget: 5000, semester: 'Previous Semesters' };
    }

    let insight = "";
    let confidence = 0.85;

    // Budget Comparison
    const diff = ((amountVal - match.avgBudget) / match.avgBudget) * 100;

    if (diff > 20) {
        insight = `Similar ${match.type}s in ${match.semester} averaged ${Math.abs(diff.toFixed(0))}% lower budgets. Checked against ${match.avgAttendees} avg attendees.`;
    } else if (diff < -20) {
        insight = `This request is ${Math.abs(diff.toFixed(0))}% lower than similar ${match.type}s from ${match.semester}.`;
    } else {
        insight = `Budget is within standard range for ${match.type}s seen in ${match.semester}.`;
    }

    res.json({
        insight,
        confidence,
        matchType: match.type
    });
});


// Mock Database
let proposals = [
    {
        id: '1',
        title: 'Blockchain Workshop',
        description: 'A workshop to teach basics of blockchain.',
        amount: 500,
        proposer: '0x123...',
        votes: 10,
        deadline: Date.now() + 86400000,
        status: 'Active'
    },
    {
        id: '2',
        title: 'Campus Hackathon',
        description: 'Annual campus hackathon event.',
        amount: 2000,
        proposer: '0x456...',
        votes: 25,
        deadline: Date.now() + 172800000,
        status: 'Active'
    }
];
let votes = [];
let users = {};

// Proposals Endpoints
app.get('/proposals', (req, res) => {
    res.json(proposals);
});

app.post('/proposals', (req, res) => {
    const newProposal = {
        id: (proposals.length + 1).toString(),
        ...req.body,
        votes: 0,
        status: 'Active',
        createdAt: new Date().toISOString()
    };
    proposals.push(newProposal);
    res.status(201).json(newProposal);
});

// Votes Endpoints
app.post('/votes', (req, res) => {
    const { proposal_id, voter_wallet } = req.body;
    
    // Simple mock voting logic
    const proposal = proposals.find(p => p.id === proposal_id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    votes.push({ proposal_id, voter_wallet, timestamp: new Date() });
    proposal.votes += 1; // Quadratic voting logic handles on chain, this is just mock display
    
    // Update user mock data
    if (!users[voter_wallet]) users[voter_wallet] = { role: 'VOTER', votes: [] };
    users[voter_wallet].votes.push(proposal_id);

    res.json({ message: 'Vote recorded', proposal });
});

// User Endpoints
app.get('/users/:wallet', (req, res) => {
    const { wallet } = req.params;
    const user = users[wallet] || { role: 'VOTER', votes: [] };
    res.json(user);
});

app.get('/notifications/:wallet', (req, res) => {
    // Return empty notifications for now
    res.json([]);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
