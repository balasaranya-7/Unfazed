const Therapist = require("../models/Therapist");

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const therapist = await Therapist.findById(
      req.therapistId
    ).select("-password_hash");

    if (!therapist) {
      return res.status(404).json({
        message: "Therapist not found",
      });
    }

    res.status(200).json({
      therapist,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      title,
      qualification,
      rciRegistered,
      rciNumber,
      phone,
      location,
      bio,
      languages,
      specializations,
      avatar,
    } = req.body;

    const therapist = await Therapist.findById(
      req.therapistId
    );

    if (!therapist) {
      return res.status(404).json({
        message: "Therapist not found",
      });
    }

    // Basic identity
    if (name !== undefined) {
      therapist.name = name.trim();
    }

    // Professional information
    if (title !== undefined) {
      therapist.title = title.trim();
    }

    if (qualification !== undefined) {
      therapist.qualification = qualification.trim();
    }

    if (rciRegistered !== undefined) {
      therapist.rciRegistered = Boolean(rciRegistered);
    }

    if (rciNumber !== undefined) {
      therapist.rciNumber = rciNumber.trim();
    }

    // Contact information
    if (phone !== undefined) {
      therapist.phone = phone.trim();
    }

    if (location !== undefined) {
      therapist.location = location.trim();
    }

    // Clinical profile
    if (bio !== undefined) {
      therapist.bio = bio;
    }

    if (languages !== undefined) {
      therapist.languages = Array.isArray(languages)
        ? languages
        : [];
    }

    if (specializations !== undefined) {
      therapist.specializations = Array.isArray(
        specializations
      )
        ? specializations
        : [];
    }

    // Profile image
    if (avatar !== undefined) {
      therapist.avatar = avatar;
    }

    // Slug is intentionally not changed here.
    // It remains the therapist's unique branded URL.

    await therapist.save();

    const updatedTherapist =
      await Therapist.findById(
        therapist._id
      ).select("-password_hash");

    res.status(200).json({
      message: "Profile updated successfully",
      therapist: updatedTherapist,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
// GET PUBLIC THERAPIST PROFILE
const getPublicProfile = async (req, res) => {
  try {
    const { slug } = req.params;

    const therapist = await Therapist.findOne({
      slug: slug.toLowerCase(),
    }).select("-password_hash -email -phone");

    if (!therapist) {
      return res.status(404).json({
        message: "Therapist profile not found",
      });
    }

    res.status(200).json({
      therapist,
    });
  } catch (error) {
    console.error("Public profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getPublicProfile,
};