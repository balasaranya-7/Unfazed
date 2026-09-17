const express = require("express");

const {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getMyClient,
  setClientPassword,
} = require("../controllers/clientController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// AUTHENTICATION
// ============================================================

router.use(authMiddleware);


// ============================================================
// ROLE PROTECTION
// ============================================================

const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.role !== requiredRole) {
      return res.status(403).json({
        message: `${requiredRole} access required`,
      });
    }

    next();
  };
};


// ============================================================
// CLIENT — OWN PROFILE
// IMPORTANT: /me MUST COME BEFORE /:id
// ============================================================

router.get(
  "/me",
  requireRole("client"),
  getMyClient
);


// ============================================================
// THERAPIST — CLIENT MANAGEMENT
// ============================================================

router.use(requireRole("therapist"));


// GET ALL CLIENTS
router.get(
  "/",
  getClients
);


// GET ONE CLIENT
router.get(
  "/:id",
  getClientById
);


// CREATE CLIENT
router.post(
  "/",
  createClient
);


// UPDATE CLIENT
router.put(
  "/:id",
  updateClient
);


// SET / UPDATE CLIENT PASSWORD
router.put(
  "/:id/password",
  setClientPassword
);


// DELETE CLIENT
router.delete(
  "/:id",
  deleteClient
);


module.exports = router;