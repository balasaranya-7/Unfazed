const express = require("express");

const {
  getProfile,
  updateProfile,
  getPublicProfile,
} = require("../controllers/therapistController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public branded therapist profile
router.get(
  "/public/:slug",
  getPublicProfile
);

// Private therapist profile
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

module.exports = router;