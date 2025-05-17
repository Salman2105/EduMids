const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const Enrollment = require("../Models/Enrollment");
const QuizSubmission = require("../Models/quizSubmission");
const Course = require("../Models/course");
const notifyUser = require("../utils/notifyUser");

// ✅ Get Student Dashboard Data
router.get("/student-dashboard", verifyToken, checkRole(["student"]), async (req, res) => {
  try {
    // Get enrolled courses
    const enrollments = await Enrollment.find({ student: req.user.id }).populate("course");

    // Get quiz submissions
    const quizSubmissions = await QuizSubmission.find({ student: req.user.id }).populate("quiz");

    // Calculate course progress
    const progress = enrollments.map((enroll) => ({
      course: enroll.course.title,
      progress: enroll.progress,
    }));

    // Format quiz results
    const quizResults = quizSubmissions.map((quiz) => ({
      quizTitle: quiz.quiz.title,
      score: quiz.score,
    }));

    // Notify the student
    await notifyUser(req.user.id, `👋 Welcome back to your Student Dashboard.`);

    // Send response
    res.status(200).json({ enrollments, progress, quizResults });
  } catch (error) {
    console.error("Error fetching student dashboard data:", error.message);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
