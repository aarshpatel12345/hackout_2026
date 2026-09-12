const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  saveOnboarding,
  getOnboarding,
} = require('../controllers/onboardingController');

// All onboarding routes require JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

router.post('/', saveOnboarding);
router.get('/', getOnboarding);

module.exports = router;
