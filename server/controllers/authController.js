const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

// In-memory fallback user store when MongoDB is offline
const inMemoryUsers = new Map();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isOnboarded: user.isOnboarded || false,
      token: generateToken(user._id),
    });
  } catch (dbError) {
    console.warn('MongoDB user creation failed, utilizing in-memory store:', dbError.message);

    if (inMemoryUsers.has(normalizedEmail)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const mockId = 'usr_' + Math.random().toString(36).substring(2, 9);
    const memUser = {
      _id: mockId,
      name,
      email: normalizedEmail,
      password,
      isOnboarded: false,
    };
    inMemoryUsers.set(normalizedEmail, memUser);

    return res.status(201).json({
      _id: memUser._id,
      name: memUser.name,
      email: memUser.email,
      isOnboarded: memUser.isOnboarded,
      token: generateToken(memUser._id),
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || '').toLowerCase().trim();

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (user) {
      const token = generateToken(user._id);
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded || false,
        token,
      });
    }

    // Fallback check memory store if DB auth failed
    if (inMemoryUsers.has(normalizedEmail)) {
      const memUser = inMemoryUsers.get(normalizedEmail);
      if (memUser.password === password) {
        const token = generateToken(memUser._id);
        return res.json({
          _id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          isOnboarded: memUser.isOnboarded || false,
          token,
        });
      }
    }

    return res.status(401).json({ message: info?.message || 'Invalid email or password' });
  })(req, res, next);
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isOnboarded: req.user.isOnboarded || false,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
