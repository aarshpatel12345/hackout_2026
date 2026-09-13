const Onboarding = require('../models/Onboarding');
const { analyzeCarbonFootprint, calculateFallbackAnalysis } = require('../services/geminiService');
const { inMemoryOnboardingStore } = require('./onboardingController');
const { detectEmissionLeaks } = require('../services/leakDetectorService');

// In-memory cache for analysis results
const inMemoryAnalysisStore = new Map();
const inMemoryLeakStore = new Map();

const Analysis = require('../models/Analysis');
const LeakAnalysis = require('../models/LeakAnalysis');

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

// @desc    Calculate emission leak points using Gemini AI
// @route   POST /api/analysis/leak-detector
// @access  Private (or Public)
const calculateLeakDetector = async (req, res) => {
  const userId = req.user?._id ? req.user._id.toString() : 'guest-user';
  try {
    const data = req.body || {};
    const result = await detectEmissionLeaks(data);
    
    const payload = { input: data, output: result };
    
    if (req.user?._id) {
      await LeakAnalysis.findOneAndUpdate(
        { user: req.user._id },
        { ...payload, user: req.user._id },
        { new: true, upsert: true }
      );
    } else {
      inMemoryLeakStore.set(userId, payload);
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error calculating emission leaks:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error calculating leaks'
    });
  }
};

// @desc    Get emission leak points
// @route   GET /api/analysis/leak-detector
// @access  Private
const getLeakDetector = async (req, res) => {
  const userId = req.user?._id ? req.user._id.toString() : 'guest-user';

  let leakData = null;
  if (req.user?._id) {
    leakData = await LeakAnalysis.findOne({ user: req.user._id });
  } else {
    leakData = inMemoryLeakStore.get(userId);
  }

  return res.status(200).json({
    success: true,
    data: leakData || null,
  });
};

module.exports = {
  calculateAnalysis,
  getAnalysis,
  calculateLeakDetector,
  getLeakDetector,
};
