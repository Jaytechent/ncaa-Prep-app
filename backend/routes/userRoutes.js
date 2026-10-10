
const express = require('express');
const router = express.Router();
const { authUser, registerUser, updateUserStats, forgotPassword, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/stats', protect, updateUserStats);

module.exports = router;
