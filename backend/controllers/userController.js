
const User = require('../models/User');
const jwt = require('jsonwebtoken');


const RESET_TOKEN_TTL_MIN = 15;
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

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

// @desc    Send password reset email
// @route   POST /api/users/forgot-password
const forgotPassword = async (req, res, next) => {
  const email = (req.body.email || '').trim().toLowerCase();
  // Same response whether or not the account exists (prevents email enumeration)
  const genericReply = { message: 'If an account with that email exists, a reset link has been sent.' };

  try {
    if (!email) {
      res.status(400);
      throw new Error('Email is required');
    }

    const user = await User.findOne({ email });
    if (!user) return res.json(genericReply);

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpires = Date.now() + RESET_TOKEN_TTL_MIN * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
    const resetUrl = `${frontendUrl}/?reset_token=${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Reset your NCAA Prep password',
        text: `Hi ${user.name},\n\nReset your password using this link (valid for ${RESET_TOKEN_TTL_MIN} minutes):\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
            <h2>Password reset</h2>
            <p>Hi ${user.name},</p>
            <p>Click the button below to choose a new password. This link expires in ${RESET_TOKEN_TTL_MIN} minutes.</p>
            <p>
              <a href="${resetUrl}"
                 style="display:inline-block;padding:12px 24px;background:#0057FF;color:#fff;text-decoration:none;font-weight:bold">
                Reset Password
              </a>
            </p>
            <p style="font-size:12px;color:#666">Or paste this link into your browser:<br/>${resetUrl}</p>
            <p style="font-size:12px;color:#666">If you didn't request this, you can safely ignore this email.</p>
          </div>`,
      });
    } catch (mailError) {
      // Don't leave a usable token behind if the email never went out
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save({ validateBeforeSave: false });
      console.error('Reset email failed:', mailError.message);
      res.status(500);
      throw new Error('Could not send reset email. Please try again later.');
    }

    res.json(genericReply);
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using emailed token
// @route   POST /api/users/reset-password
const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  try {
    if (!token || !newPassword) {
      res.status(400);
      throw new Error('Token and new password are required');
    }
    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    const user = await User.findOne({
      resetPasswordToken: hashToken(token),
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      res.status(400);
      throw new Error('Reset link is invalid or has expired');
    }

    user.password = newPassword; // hashed by the pre('save') hook
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { authUser, registerUser, updateUserStats, forgotPassword, resetPassword };
