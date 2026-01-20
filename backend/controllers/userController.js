
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ncaa_secret_key_777', { expiresIn: '30d' });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
const authUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        stats: user.stats,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/users
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user stats
// @route   PUT /api/users/stats
const updateUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.stats.totalQuizzes += 1;
      const { trade, score, total } = req.body;
      user.stats.history.push({ trade, score, total });
      
      const allScores = user.stats.history.map(h => (h.score / h.total) * 100);
      user.stats.averageScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
      
      const updatedUser = await user.save();
      res.json(updatedUser.stats);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { authUser, registerUser, updateUserStats };
