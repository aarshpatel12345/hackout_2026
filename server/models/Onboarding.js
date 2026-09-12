const mongoose = require('mongoose');

const energyItemSchema = new mongoose.Schema({
  energyType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kWh' },
});

const materialItemSchema = new mongoose.Schema({
  materialName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  materialType: { type: String, enum: ['Virgin', 'Recycled'], default: 'Virgin' },
});

const wasteItemSchema = new mongoose.Schema({
  wasteType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  disposalMethod: { type: String, required: true },
});

const processItemSchema = new mongoose.Schema({
  processName: { type: String, required: true },
  energyAssociated: { type: String, default: '' },
  materialAssociated: { type: String, default: '' },
  wasteAssociated: { type: String, default: '' },
});

const onboardingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // 🏭 Business
    business: {
      industry: { type: String, required: true },
      productionQuantity: { type: Number, required: true },
      productionUnit: { type: String, default: 'units/yr' },
      analysisPeriod: { type: String, required: true, default: 'Annual' },
    },
    // ⚡ Energy
    energy: [energyItemSchema],

    // 🧱 Materials
    materials: [materialItemSchema],

    // ♻️ Waste
    waste: [wasteItemSchema],

    // ⚙️ Processes
    processes: [processItemSchema],

    // 💰 Costs
    costs: {
      energyCost: { type: Number, default: 0 },
      materialCost: { type: Number, default: 0 },
      wasteCost: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
    },

    // 🎯 Constraints
    constraints: {
      availableBudget: { type: Number, default: 0 },
      preferredPaybackPeriod: { type: String, default: '1-3 years' },
    },
  },
  {
    timestamps: true,
  }
);

const Onboarding = mongoose.model('Onboarding', onboardingSchema);

module.exports = Onboarding;
