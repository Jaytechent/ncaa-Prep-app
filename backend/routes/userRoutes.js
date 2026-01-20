
const express = require('express');
const router = express.Router();
const { authUser, registerUser, updateUserStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.put('/stats', protect, updateUserStats);

module.exports = router;
