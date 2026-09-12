const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  calculateAnalysis,
  getAnalysis,
} = require('../controllers/analysisController');

// Optional authentication middleware with fallback
const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) {
      req.user = user;
    }
    return next();
  })(req, res, next);
};

router.use(optionalAuth);

router.post('/calculate', calculateAnalysis);
router.get('/', getAnalysis);

module.exports = router;
