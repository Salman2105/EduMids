const express = require("express");
const path = require("path");
const fs = require("fs");
const { verifyToken } = require("../middleware/authMiddleware");
const DownloadHistory = require("../Models/downloadHistory");
const Lesson = require("../Models/lesson");
const router = express.Router();

// Download a lesson file and log the download history
router.get("/lesson/:lessonId", verifyToken, async (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    if (!lesson.contentType || !["video", "pdf"].includes(lesson.contentType)) {
      return res.status(400).json({ message: "This lesson type cannot be downloaded." });
    }
    if (!lesson.contentURL) {
      return res.status(404).json({ message: "No file found for this lesson." });
    }
    // Build file path
    const filePath = lesson.contentURL.startsWith("uploads/")
      ? path.join(__dirname, "..", lesson.contentURL)
      : path.join(__dirname, "..", "uploads", lesson.contentURL);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File does not exist on server." });
    }
    // Log download history
    await DownloadHistory.create({
      user: req.user ? req.user.id : null,
      fileName: path.basename(filePath),
      filePath: lesson.contentURL,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
    });
    // Download file
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: "Error downloading file." });
      }
    });
  } catch (error) {
    console.error("Error in download-lesson:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// (Updated) Get download history for current user or all if admin
router.get("/history", verifyToken, async (req, res) => {
  try {
    let history;
    if (req.user.role === "admin") {
      history = await DownloadHistory.find()
        .populate("user", "name email")
        .sort({ downloadedAt: -1 });
    } else {
      history = await DownloadHistory.find({ user: req.user.id })
        .populate("user", "name email")
        .sort({ downloadedAt: -1 });
    }
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
