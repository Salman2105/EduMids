const express = require("express");
const router = express.Router();
const Question = require("../Models/question");
const { Course } = require("../Models/course");
const Enrollment = require("../Models/Enrollment");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// STUDENT: Ask a question about a lesson/course
router.post("/ask", verifyToken, checkRole(["student"]), async (req, res) => {
  try {
    const { courseId, lessonId, text } = req.body;

    // Check enrollment
    const enrolled = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!enrolled) return res.status(403).json({ message: "Not enrolled in this course" });

    const question = new Question({
      askedBy: req.user.id,
      course: courseId,
      lesson: lessonId || null,
      text,
    });
    await question.save();
    // Populate for frontend consistency
    await question.populate("askedBy course");
    res.status(201).json({ message: "Question posted", question });
  } catch (err) {
    res.status(500).json({ message: "Error posting question", error: err.message });
  }
});

// TEACHER: Answer a question from your course
router.post("/answer/:questionId", verifyToken, checkRole(["teacher"]), async (req, res) => {
  try {
    const { text } = req.body;
    const question = await Question.findById(req.params.questionId).populate("course");
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.course.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "You can't answer this question" });

    question.answers.push({ answeredBy: req.user.id, text });
    question.status = "answered";
    await question.save();
    // Populate answers for frontend
    await question.populate("askedBy course answers.answeredBy");
    res.status(200).json({ message: "Answered", question });
  } catch (err) {
    res.status(500).json({ message: "Error answering question", error: err.message });
  }
});

// ADMIN: Get all questions with filters
router.get("/all", verifyToken, checkRole(["admin", "teacher", "student"]), async (req, res) => {
  try {
    const questions = await Question.find().populate("askedBy course answers.answeredBy").sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions", error: err.message });
  }
});

// ADMIN: Soft delete a question
router.delete("/:id", verifyToken, checkRole(["admin"]), async (req, res) => {
  try {
    await Question.findByIdAndUpdate(req.params.id, { deleted: true });
    res.status(200).json({ message: "Question soft deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting", error: err.message });
  }
});

module.exports = router;
