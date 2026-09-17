const Therapist = require("../models/Therapist");
const SubscriptionTierConfig = require("../models/SubscriptionTierConfig");

const DEFAULTS = {
  free: { maxClients: 10, maxSessionsPerMonth: 20, features: ["basic_analytics"] },
  starter: { maxClients: 50, maxSessionsPerMonth: 100, features: ["basic_analytics", "chat", "packages"] },
  professional: { maxClients: 500, maxSessionsPerMonth: 1000, features: ["basic_analytics", "deep_analytics", "chat", "packages", "shared_notes"] },
};

const getTier = async (therapistId) => {
  const therapist = await Therapist.findById(therapistId).select("subscriptionTier");
  const tier = therapist?.subscriptionTier || "free";
  const config = await SubscriptionTierConfig.findOne({ key: tier }).lean();
  return { key: tier, ...(config || DEFAULTS[tier] || DEFAULTS.free) };
};

const canAccess = async (therapistId, featureKey) => {
  const tier = await getTier(therapistId);
  return Array.isArray(tier.features) && tier.features.includes(featureKey);
};

module.exports = { DEFAULTS, getTier, canAccess };
