const Onboarding = require('../models/Onboarding');
const { analyzeCarbonFootprint, calculateFallbackAnalysis } = require('../services/geminiService');
const { inMemoryOnboardingStore } = require('./onboardingController');

// In-memory cache for analysis results
const inMemoryAnalysisStore = new Map();

const Analysis = require('../models/Analysis');

// Helper to retrieve user's onboarding data
async function getUserOnboardingData(userId) {
  try {
    const dbData = await Onboarding.findOne({ user: userId });
    if (dbData) return dbData;
  } catch (err) {
    // Ignore DB error
  }
  return inMemoryOnboardingStore?.get?.(userId) || null;
}

// @desc    Calculate carbon footprint & circular interventions using Gemini AI
// @route   POST /api/analysis/calculate
// @access  Private
const calculateAnalysis = async (req, res) => {
  const userId = req.user?._id ? req.user._id.toString() : 'guest-user';

  try {
    let onboardingData = req.body?.onboardingData;

    if (!onboardingData) {
      onboardingData = await getUserOnboardingData(userId);
    }

    const result = await analyzeCarbonFootprint(onboardingData || {});
    
    // Store in DB if it's a real user
    if (req.user?._id) {
      await Analysis.findOneAndUpdate(
        { user: req.user._id },
        { ...result, user: req.user._id },
        { new: true, upsert: true }
      );
    } else {
      inMemoryAnalysisStore.set(userId, result);
    }

    return res.status(200).json({
      success: true,
      message: 'Analysis calculated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error calculating carbon analysis:', error);
    const fallbackResult = calculateFallbackAnalysis(req.body?.onboardingData || {});
    
    if (req.user?._id) {
      await Analysis.findOneAndUpdate(
        { user: req.user._id },
        { ...fallbackResult, user: req.user._id },
        { new: true, upsert: true }
      );
    } else {
      inMemoryAnalysisStore.set(userId, fallbackResult);
    }

    return res.status(200).json({
      success: true,
      message: 'Analysis calculated using fallback engine',
      data: fallbackResult,
    });
  }
};

// @desc    Get carbon footprint & circular interventions analysis
// @route   GET /api/analysis
// @access  Private
const getAnalysis = async (req, res) => {
  const userId = req.user?._id ? req.user._id.toString() : 'guest-user';

  let analysis = null;

  if (req.user?._id) {
    analysis = await Analysis.findOne({ user: req.user._id });
  } else {
    analysis = inMemoryAnalysisStore.get(userId);
  }

  if (!analysis) {
    // Fetch user's onboarding data
    const onboardingData = await getUserOnboardingData(userId);
    analysis = await analyzeCarbonFootprint(onboardingData || {});
    
    if (req.user?._id) {
      await Analysis.findOneAndUpdate(
        { user: req.user._id },
        { ...analysis, user: req.user._id },
        { new: true, upsert: true }
      );
    } else {
      inMemoryAnalysisStore.set(userId, analysis);
    }
  }

  return res.status(200).json({
    success: true,
    data: analysis,
  });
};

module.exports = {
  calculateAnalysis,
  getAnalysis,
};
