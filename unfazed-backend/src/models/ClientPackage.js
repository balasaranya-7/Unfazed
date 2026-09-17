const mongoose = require("mongoose");

const clientPackageSchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true,
      index: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    totalSessions: {
      type: Number,
      required: true,
    },

    usedSessions: {
      type: Number,
      default: 0,
    },

    remainingSessions: {
      type: Number,
      required: true,
    },

    purchasedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "active",
        "completed",
        "expired",
        "cancelled",
      ],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ClientPackage",
  clientPackageSchema
);