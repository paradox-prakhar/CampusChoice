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

app.listen(port, () => {
    console.log(`AI Service running on http://localhost:${port}`);
});
