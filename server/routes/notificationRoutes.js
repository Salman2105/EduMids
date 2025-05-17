const express = require("express");
const router = express.Router();
const Notification = require("../Models/notification");
const auth = require("../middleware/auth");

// Get all notifications for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Mark as read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Marked as read", notification: updated });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking as read" });
  }
});

module.exports = router;
