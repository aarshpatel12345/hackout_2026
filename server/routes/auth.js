const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  getUserProfile
);

module.exports = router;
