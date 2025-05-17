const Progress = require("../models/Progress");
const express = require("express");
const router = express.Router();
const Course = require("../Models/course"); // Import Progress Model
const Lesson = require("../Models/lesson");
const auth = require("../middleware/auth");
const notifyUser = require("../utils/notifyUser");

// ✅ Mark a Lesson as Completed
router.post("/complete-lesson", auth, async (req, res) => {
  const { courseId, lessonId } = req.body;

  try {
    // Find or create progress for the user and course
    let progress = await Progress.findOne({ userId: req.user.id, courseId });

    if (!progress) {
      progress = new Progress({ userId: req.user.id, courseId, completedLessons: [] });
    }

    // Add the lesson to completedLessons if not already completed
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    // Calculate progress percentage
    const totalLessons = await Lesson.countDocuments({ courseId });
    progress.progressPercentage = (progress.completedLessons.length / totalLessons) * 100;

    await progress.save();

    // Notify the user if the course is completed
    if (progress.progressPercentage === 100) {
      const course = await Course.findById(courseId);
      await notifyUser(req.user.id, `🏁 Congratulations! You've completed the course "${course.title}".`);
    }

    res.status(200).json({ message: "Lesson marked as completed", progress });
  } catch (error) {
    console.error("Error marking lesson as completed:", error.message);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Get Student Progress for a Course
router.get("/:courseId", auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user.id,
      courseId: req.params.courseId,
    }).populate("completedLessons");

    if (!progress) return res.status(404).json({ message: "No progress found" });

    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error.message);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;