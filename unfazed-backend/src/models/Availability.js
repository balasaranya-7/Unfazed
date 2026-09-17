const mongoose = require("mongoose");

const dayScheduleSchema = new mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: false,
    },

    start: {
      type: String,
      default: "09:00",
    },

    end: {
      type: String,
      default: "17:00",
    },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true,
      unique: true,
      index: true,
    },

    weeklySchedule: {
      sunday: {
        type: dayScheduleSchema,
        default: () => ({
          active: false,
          start: "09:00",
          end: "17:00",
        }),
      },

      monday: {
        type: dayScheduleSchema,
        default: () => ({
          active: true,
          start: "09:00",
          end: "17:00",
        }),
      },

      tuesday: {
        type: dayScheduleSchema,
        default: () => ({
          active: true,
          start: "09:00",
          end: "17:00",
        }),
      },

      wednesday: {
        type: dayScheduleSchema,
        default: () => ({
          active: true,
          start: "09:00",
          end: "17:00",
        }),
      },

      thursday: {
        type: dayScheduleSchema,
        default: () => ({
          active: true,
          start: "09:00",
          end: "17:00",
        }),
      },

      friday: {
        type: dayScheduleSchema,
        default: () => ({
          active: true,
          start: "09:00",
          end: "17:00",
        }),
      },

      saturday: {
        type: dayScheduleSchema,
        default: () => ({
          active: false,
          start: "09:00",
          end: "17:00",
        }),
      },
    },

    bufferTime: {
      type: Number,
      default: 15,
    },

    blockedDates: {
      type: [String],
      default: [],
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Availability", availabilitySchema);