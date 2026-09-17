const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    therapist: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    source: { type: String, default: "Direct", trim: true },
    status: { type: String, enum: ["New", "Contacted", "Qualified", "Converted", "Lost"], default: "New", index: true },
    concern: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true },
    lastContactedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

leadSchema.index({ therapist: 1, createdAt: -1 });

module.exports = mongoose.model("Lead", leadSchema);
