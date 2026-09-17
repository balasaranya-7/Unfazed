const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
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

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // Used for client login
    password_hash: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    age: {
      type: Number,
      default: null,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      default: "",
      trim: true,
    },

    occupation: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    preferredMode: {
      type: String,
      default: "",
      trim: true,
    },

    intakeSummary: {
      primaryConcern: {
        type: String,
        default: "",
      },

      medicalHistory: {
        type: String,
        default: "",
      },

      emergencyContact: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    notes: {
      type: String,
      default: "",
    },

    consentSigned: {
      type: Boolean,
      default: false,
    },

    consentDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", clientSchema);