const Availability = require("../models/Availability");
const Session = require("../models/Session");

const getTherapistId = (req) => {
  return req.therapistId || req.user?.therapistId || req.user?._id;
};

// =====================================================
// AVAILABILITY
// =====================================================

exports.getAvailability = async (req, res) => {
  try {
    const therapistId = getTherapistId(req);

    if (!therapistId) {
      return res.status(401).json({
        message: "Therapist authentication required",
      });
    }

    let availability = await Availability.findOne({
      therapist: therapistId,
    });

    if (!availability) {
      availability = await Availability.create({
        therapist: therapistId,
      });
    }

    res.json(availability);
  } catch (error) {
    console.error("Get availability error:", error);

    res.status(500).json({
      message: "Failed to fetch availability",
      error: error.message,
    });
  }
};

exports.saveAvailability = async (req, res) => {
  try {
    const therapistId = getTherapistId(req);

    if (!therapistId) {
      return res.status(401).json({
        message: "Therapist authentication required",
      });
    }

    const {
      weeklySchedule,
      bufferTime,
      blockedDates,
      timezone,
    } = req.body;

    if (!weeklySchedule) {
      return res.status(400).json({
        message: "weeklySchedule is required",
      });
    }

    const availability = await Availability.findOneAndUpdate(
      {
        therapist: therapistId,
      },
      {
        therapist: therapistId,
        weeklySchedule,
        bufferTime:
          bufferTime !== undefined ? Number(bufferTime) : 15,
        blockedDates: Array.isArray(blockedDates)
          ? blockedDates
          : [],
        timezone: timezone || "Asia/Kolkata",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      message: "Availability saved successfully",
      availability,
    });
  } catch (error) {
    console.error("Save availability error:", error);

    res.status(500).json({
      message: "Failed to save availability",
      error: error.message,
    });
  }
};

// =====================================================
// SESSIONS
// =====================================================

exports.getSessions = async (req, res) => {
  try {
    const therapistId = getTherapistId(req);

    if (!therapistId) {
      return res.status(401).json({
        message: "Therapist authentication required",
      });
    }

    const sessions = await Session.find({
      therapist: therapistId,
    })
      .populate("client")
      .sort({
        startTime: 1,
      });

    res.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error);

    res.status(500).json({
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
};

exports.createSession = async (req, res) => {
  try {
    const therapistId = getTherapistId(req);

    if (!therapistId) {
      return res.status(401).json({
        message: "Therapist authentication required",
      });
    }

    const {
      client,
      startTime,
      endTime,
      timezone,
      sessionType,
      notes,
    } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({
        message: "startTime and endTime are required",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid date/time",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    // Double-booking prevention
    const overlappingSession = await Session.findOne({
      therapist: therapistId,
      status: {
        $nin: ["cancelled"],
      },
      startTime: {
        $lt: end,
      },
      endTime: {
        $gt: start,
      },
    });

    if (overlappingSession) {
      return res.status(409).json({
        message:
          "This time slot is already booked. Please choose another time.",
      });
    }

    const session = await Session.create({
      therapist: therapistId,
      client: client || null,
      startTime: start,
      endTime: end,
      timezone: timezone || "Asia/Kolkata",
      sessionType: sessionType || "Therapy Session",
      notes: notes || "",
      status: "confirmed",
    });

    const populatedSession = await Session.findById(
      session._id
    ).populate("client");

    res.status(201).json({
      message: "Session booked successfully",
      session: populatedSession,
    });
  } catch (error) {
    console.error("Create session error:", error);

    res.status(500).json({
      message: "Failed to create session",
      error: error.message,
    });
  }
};

exports.cancelSession = async (req, res) => {
  try {
    const therapistId = getTherapistId(req);

    if (!therapistId) {
      return res.status(401).json({
        message: "Therapist authentication required",
      });
    }

    const session = await Session.findOneAndUpdate(
      {
        _id: req.params.id,
        therapist: therapistId,
      },
      {
        status: "cancelled",
      },
      {
        new: true,
      }
    );

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.json({
      message: "Session cancelled successfully",
      session,
    });
  } catch (error) {
    console.error("Cancel session error:", error);

    res.status(500).json({
      message: "Failed to cancel session",
      error: error.message,
    });
  }
};
exports.deleteSession = async (req, res) => {
  try {
    const therapistId = getTherapistId(req);
    if (!therapistId) return res.status(401).json({ message: "Therapist authentication required" });
    const session = await Session.findOneAndDelete({ _id: req.params.id, therapist: therapistId });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ message: "Failed to delete session", error: error.message });
  }
};
