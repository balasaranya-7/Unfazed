const express = require("express");
const router = express.Router();
const controller = require("../controllers/noteController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.get("/", controller.getNotes);
router.post("/", controller.createNote);
router.put("/:id", controller.updateNote);
router.delete("/:id", controller.deleteNote);
router.get("/shared/:clientId", controller.getSharedNotes);

module.exports = router;
