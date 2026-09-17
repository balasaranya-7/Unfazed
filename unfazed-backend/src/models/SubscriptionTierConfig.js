const mongoose = require("mongoose");
const subscriptionTierConfigSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  priceMonthly: { type: Number, default: 0 },
  maxClients: { type: Number, default: 10 },
  maxSessionsPerMonth: { type: Number, default: 20 },
  features: { type: [String], default: [] },
}, { timestamps: true });
module.exports = mongoose.model("SubscriptionTierConfig", subscriptionTierConfigSchema);
