const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, StudentProfile, MentorProfile } = require('../models');

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

function sanitize(user) {
  const { id, name, email, role, avatar, phone, status, createdAt } = user;
  return { id, name, email, role, avatar, phone, status, createdAt };
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'name/email/password', message: 'Name, email and password are required' }] });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'password', message: 'Password must be at least 6 characters' }] });
    }
    const allowedRoles = ['student', 'mentor'];
    const finalRole = allowedRoles.includes(role) ? role : 'student';

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'email', message: 'An account with this email already exists' }] });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: finalRole });

    if (finalRole === 'student') await StudentProfile.create({ userId: user.id });
    if (finalRole === 'mentor') await MentorProfile.create({ userId: user.id });

    const token = signToken(user);
    res.status(201).json({ success: true, message: 'Account created successfully', data: { user: sanitize(user), token } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'email/password', message: 'Email and password are required' }] });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated' });
    }
    const token = signToken(user);
    res.json({ success: true, message: 'Logged in successfully', data: { user: sanitize(user), token } });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  // Stateless JWT — client discards the token. Present for API completeness.
  res.json({ success: true, message: 'Logged out successfully', data: {} });
};

exports.me = async (req, res) => {
  res.json({ success: true, message: 'Current user', data: { user: sanitize(req.user) } });
};
