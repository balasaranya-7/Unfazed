const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
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
      default: null,
    },

    startTime: {
      type: Date,
      required: true,
      index: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "confirmed",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "scheduled",
    },

    sessionType: {
      type: String,
      default: "Therapy Session",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);