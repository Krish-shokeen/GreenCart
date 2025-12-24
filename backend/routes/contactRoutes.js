const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  submitContactForm,
  getAllMessages,
  markAsRead,
  deleteMessage
} = require("../controllers/contactController");

// Public route - Submit contact form
router.post("/", submitContactForm);

// Admin routes (you can add admin middleware later)
router.get("/messages", authMiddleware, getAllMessages);
router.put("/messages/:messageId/read", authMiddleware, markAsRead);
router.delete("/messages/:messageId", authMiddleware, deleteMessage);

module.exports = router;