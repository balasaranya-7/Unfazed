const mongoose = require("mongoose");
const Client = require("../models/Client");
const Session = require("../models/Session");
const Payment = require("../models/Payment");

const getAnalytics = async (req, res) => {
  try {
    const therapist = req.therapistId || req.user?.therapistId || req.user?.id || req.user?._id;
    const [clients, sessions, revenue] = await Promise.all([
      Client.countDocuments({ therapist }),
      Session.countDocuments({ therapist, status: { $ne: "cancelled" } }),
      Payment.aggregate([
        { $match: { therapist: mongoose.Types.ObjectId.createFromHexString(String(therapist)), status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);
    const monthly = await Session.aggregate([
      { $match: { therapist: mongoose.Types.ObjectId.createFromHexString(String(therapist)), status: { $ne: "cancelled" } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$startTime", timezone: "Asia/Kolkata" } }, sessions: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ summary: { clients, sessions, revenue: revenue[0]?.total || 0 }, monthly });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

module.exports = { getAnalytics };
