const express = require("express");

const router = express.Router();

const schedulingController = require("../controllers/schedulingController");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// AVAILABILITY
// =====================================================

router.get(
  "/availability",
  authMiddleware,
  schedulingController.getAvailability
);

router.put(
  "/availability",
  authMiddleware,
  schedulingController.saveAvailability
);

// =====================================================
// SESSIONS
// =====================================================

router.get(
  "/sessions",
  authMiddleware,
  schedulingController.getSessions
);

router.post(
  "/sessions",
  authMiddleware,
  schedulingController.createSession
);

router.patch(
  "/sessions/:id/cancel",
  authMiddleware,
  schedulingController.cancelSession
);

router.delete(
  "/sessions/:id",
  authMiddleware,
  schedulingController.deleteSession
);

module.exports = router;