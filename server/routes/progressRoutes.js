const Progress = require("../Models/Progress");
const express = require("express");
const router = express.Router();
const Course = require("../Models/course"); // Import Progress Model
const Lesson = require("../Models/lesson");
const auth = require("../middleware/auth");
const notifyUser = require("../utils/notifyUser");
const Enrollment = require("../Models/Enrollment"); // Import Enrollment Model

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

    // Update Enrollment progress field as well
    const enrollment = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (enrollment) {
      enrollment.progress = progress.progressPercentage;
      await enrollment.save();
    }

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

// ✅ Get all progress for a student (with course and lesson details)
router.get("/my-progress", auth, async (req, res) => {
  try {
    const progresses = await Progress.find({ userId: req.user.id })
      .populate({
        path: "courseId",
        populate: [
          { path: "teacher", select: "firstName lastName" },
          { path: "category", select: "name" },
          { path: "lessons" },
        ],
      })
      .populate("completedLessons");
    return res.status(200).json(progresses);
  } catch (error) {
    console.error("Error fetching all progress:", error.message);
    return res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Get all enrolled courses with progress for a student
router.get("/my-enrolled-progress", auth, async (req, res) => {
  try {
    // Find all enrollments for the student
    const enrollments = await Enrollment.find({ student: req.user.id }).populate({
      path: "course",
      populate: [
        { path: "teacher", select: "firstName lastName" },
        { path: "category", select: "name" },
        { path: "lessons" },
      ],
    });

    // Fetch all progress documents for the user
    const progresses = await Progress.find({ userId: req.user.id });

    // Map courseId to progress for quick lookup
    const progressMap = {};
    progresses.forEach((p) => {
      progressMap[p.courseId.toString()] = p;
    });

    // Build result: for each enrollment, attach progress if exists
    const result = enrollments.map((enrollment) => {
      const course = enrollment.course;
      const progress = progressMap[course._id.toString()];
      return {
        courseId: course,
        progressPercentage: progress ? progress.progressPercentage : 0,
        completedLessons: progress ? progress.completedLessons : [],
        _id: progress ? progress._id : null,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching enrolled courses with progress:", error.message);
    return res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;