const express = require("express");

const {
  register,
  registerClient,
  login,
  getMe,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =========================================================
// THERAPIST REGISTER
// POST /api/auth/register
// =========================================================

router.post(
  "/register",
  register
);

// =========================================================
// CLIENT REGISTER
// POST /api/auth/register-client
// =========================================================

router.post(
  "/register-client",
  registerClient
);

// =========================================================
// LOGIN
// POST /api/auth/login
// =========================================================

router.post(
  "/login",
  login
);

// =========================================================
// CURRENT THERAPIST
// GET /api/auth/me
// =========================================================

router.get(
  "/me",
  authMiddleware,
  getMe
);

module.exports = router;