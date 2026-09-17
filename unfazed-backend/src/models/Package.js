const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    sessionCount: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    sessionRate: {
      type: Number,
      required: true,
      min: 0,
    },

    validityDays: {
      type: Number,
      default: 90,
      min: 1,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    features: {
      type: [String],
      default: [],
    },

    savingsPercent: {
      type: Number,
      default: 0,
      min: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// One therapist can have multiple packages
packageSchema.index({
  therapist: 1,
  sessionCount: 1,
});

module.exports = mongoose.model(
  "Package",
  packageSchema
);