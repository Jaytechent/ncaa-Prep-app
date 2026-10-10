
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ncaa_secret_key_777', { expiresIn: '30d' });
};


const sendPasswordResetEmail = async (email, resetUrl) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Password reset email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.');
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, ''),
    },
  });
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.GMAIL_USER,
    to: email,
    subject: 'Reset your NCAA Prep password',
    text: `We received a request to reset your NCAA Prep password. Open this link within 15 minutes:\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#111"><h2>NCAA Prep password reset</h2><p>We received a request to reset your password.</p><p><a href="${resetUrl}" style="display:inline-block;background:#0057ff;color:#fff;padding:12px 18px;text-decoration:none">Reset password</a></p><p>This link expires in 15 minutes and can only be used once.</p><p>If you did not request this, you can ignore this email.</p></div>`,
  });
};

// @desc    Request a password reset email
// @route   POST /api/users/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    // Always use the same response so the endpoint does not reveal registered emails.
    const response = { message: 'If an account exists for that email, a password reset link has been sent.' };
    if (!user) return res.json(response);

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const resetUrl = `${frontendUrl}/?resetToken=${rawToken}`;
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (mailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      throw mailError;
    }
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Set a new password using a valid reset token
// @route   POST /api/users/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'A reset token and a password of at least 8 characters are required.' });
    }
    const hashedToken = crypto.createHash('sha256').update(String(token)).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: 'This password reset link is invalid or has expired. Request a new one.' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.json({ message: 'Password reset successful. You can now sign in with your new password.' });
  } catch (error) {
    next(error);
  }
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
  const { name, email, password, adminSecret } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Determine role based on admin secret
    const role = (adminSecret && adminSecret === process.env.ADMIN_SECRET) ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
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

module.exports = { authUser, registerUser, updateUserStats, forgotPassword, resetPassword };
