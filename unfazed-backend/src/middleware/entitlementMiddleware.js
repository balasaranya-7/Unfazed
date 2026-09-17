const { canAccess } = require("../services/entitlementService");

const requireEntitlement = (featureKey) => async (req, res, next) => {
  try {
    const therapistId = req.therapistId || req.user?.therapistId || req.user?.id || req.user?._id;
    if (!therapistId) return res.status(401).json({ message: "Therapist authentication required" });
    if (!(await canAccess(therapistId, featureKey))) {
      return res.status(403).json({ message: "Feature unavailable on your current plan", featureKey, upgradeRequired: true });
    }
    next();
  } catch (error) { next(error); }
};
module.exports = requireEntitlement;
