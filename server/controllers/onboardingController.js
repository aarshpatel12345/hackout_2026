const Onboarding = require('../models/Onboarding');
const User = require('../models/User');

// In-memory fallback cache when MongoDB is offline
const inMemoryOnboardingStore = new Map();

// @desc    Create or update onboarding data for authenticated user
// @route   POST /api/onboarding
// @access  Private
const saveOnboarding = async (req, res) => {
  const userId = req.user._id ? req.user._id.toString() : 'guest-user';
  const { business, energy, materials, waste, processes, costs, constraints } = req.body;

  const onboardingData = {
    user: userId,
    business,
    energy,
    materials,
    waste,
    processes,
    costs,
    constraints,
    updatedAt: new Date(),
  };

  try {
    const onboarding = await Onboarding.findOneAndUpdate(
      { user: userId },
      onboardingData,
      { new: true, upsert: true, runValidators: true }
    );

    // Update user isOnboarded flag
    await User.findByIdAndUpdate(userId, { isOnboarded: true }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'Onboarding data saved successfully',
      data: onboarding,
    });
  } catch (error) {
    console.warn('MongoDB query failed, saving onboarding data to memory fallback:', error.message);
    
    // Save to memory store
    inMemoryOnboardingStore.set(userId, onboardingData);

    return res.status(200).json({
      success: true,
      message: 'Onboarding data saved successfully (memory fallback)',
      data: onboardingData,
    });
  }
};

// @desc    Get onboarding data for authenticated user
// @route   GET /api/onboarding
// @access  Private
const getOnboarding = async (req, res) => {
  const userId = req.user._id ? req.user._id.toString() : 'guest-user';

  try {
    const onboarding = await Onboarding.findOne({ user: userId });

    if (onboarding) {
      return res.status(200).json({
        success: true,
        data: onboarding,
      });
    }
  } catch (error) {
    console.warn('MongoDB query failed, reading onboarding data from memory fallback:', error.message);
  }

  // Fallback to memory store if DB missing or item not found
  const memoryData = inMemoryOnboardingStore.get(userId) || null;
  return res.status(200).json({
    success: true,
    data: memoryData,
    message: memoryData ? 'Retrieved from memory cache' : 'No onboarding data found for this user',
  });
};

module.exports = {
  saveOnboarding,
  getOnboarding,
  inMemoryOnboardingStore,
};
