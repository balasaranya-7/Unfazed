const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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
      default: null,
    },

    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", default: null },

    gatewayTransactionId: { type: String, default: "" },
    platformFee: { type: Number, default: 0, min: 0 },
    netAmount: { type: Number, default: 0, min: 0 },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: [
        "created",
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "created",
    },

    paymentMethod: {
      type: String,
      default: "Razorpay",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    invoiceNumber: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);