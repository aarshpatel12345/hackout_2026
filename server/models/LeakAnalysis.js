const mongoose = require('mongoose');

const leakAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const LeakAnalysis = mongoose.model('LeakAnalysis', leakAnalysisSchema);

module.exports = LeakAnalysis;
