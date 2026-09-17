const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema(
  {
    // Basic identity
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password_hash: {
      type: String,
      required: true,
    },

    // Professional information
    title: {
      type: String,
      default: "",
      trim: true,
    },

    qualification: {
      type: String,
      default: "",
      trim: true,
    },

    rciRegistered: {
      type: Boolean,
      default: false,
    },

    rciNumber: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    // Public branded profile
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    bio: {
      type: String,
      default: "",
    },

    languages: {
      type: [String],
      default: [],
    },

    specializations: {
      type: [String],
      default: [],
    },

    subscriptionTier: {
      type: String,
      enum: ["free", "starter", "professional"],
      default: "free",
    },

    // Profile image URL for future cloud storage
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Therapist", therapistSchema);