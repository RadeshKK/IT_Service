const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { categorizeTicket, getSolutionSuggestions } = require('../services/aiService');

const router = express.Router();

// Categorize ticket using AI
router.post('/categorize', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const result = await categorizeTicket(title, description);

    res.json({
      category: result.category,
      priority: result.priority,
      confidence: result.confidence
    });
  } catch (error) {
    console.error('AI categorization error:', error);
    res.status(500).json({ message: 'Failed to categorize ticket' });
  }
});

// Get solution suggestions
router.post('/suggestions', authenticateToken, requireRole(['admin', 'agent']), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const suggestions = await getSolutionSuggestions(title, description, category);

    res.json({ suggestions });
  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({ message: 'Failed to get suggestions' });
  }
});

module.exports = router;
