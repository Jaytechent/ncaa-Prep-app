const express = require('express');
const router  = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { parseQuestions }  = require('../controllers/parseController');

// POST /api/parse/text
// Body: { rawText: string, trade: string }
// Auth: admin JWT required
router.post('/text', protect, admin, parseQuestions);

module.exports = router;