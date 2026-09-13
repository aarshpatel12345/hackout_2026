const mongoose = require('mongoose');

const topEmissionSourceSchema = new mongoose.Schema({
  source: { type: String },
  emissions: { type: Number },
  unit: { type: String, default: 'tCO2e' },
  percentage: { type: Number }
});

const recommendationSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String },
  category: { type: String },
  co2Reduction: { type: String },
  estimatedCost: { type: String },
  payback: { type: String },
  priority: { type: String },
  description: { type: String }
});

const wasteReuseMatchSchema = new mongoose.Schema({
  id: { type: Number },
  strategyName: { type: String },
  strategyDescription: { type: String },
  wasteUsedAsRawMaterial: { type: String },
  targetOrganizations: { type: String },
  marketValueRange: { type: String }
});

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    totalCarbonFootprint: { type: Number },
    unit: { type: String, default: 'tCO2e/year' },
    topEmissionSources: [topEmissionSourceSchema],
    aiSummaryParagraph: { type: String },
    recommendations: [recommendationSchema],
    wasteReuseMatches: [wasteReuseMatchSchema],
    calculationEngine: { type: String },
    analyzedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
