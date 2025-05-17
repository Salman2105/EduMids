const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const Quiz = require("../Models/quiz");
const QuizSubmission = require("../Models/quizSubmission");
const { quizValidation } = require("../validators/quizValidator");
const { validationResult } = require("express-validator");
const notifyUser = require("../utils/notifyUser");

// ✅ Create a Quiz (Admin Only)
router.post("/create", verifyToken, checkRole(["admin"]), quizValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { course, title, questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions are required and must be an array" });
    }

    // Validate each question
    for (const question of questions) {
      if (!question.questionText || !question.options || question.options.length < 2 || !question.correctAnswer) {
        return res.status(400).json({
          message: "Each question must have a questionText, at least two options, and a correctAnswer",
        });
      }
    }

    const newQuiz = new Quiz({ course, title, questions });

    await newQuiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Error creating quiz:", error.message);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Get Quizzes for a Course
router.get("/course/:courseId", verifyToken, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Delete a Quiz (Admin Only)
router.delete("/delete-quiz/:quizId", verifyToken, checkRole(["admin"]), async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error.message);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Submit Quiz Answers (Student)
router.post("/submit-quiz/:quizId", verifyToken, async (req, res) => {
  try {
    const { answers } = req.body;

    // Validate answers array
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    // Find the quiz
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Validate the number of answers
    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: "Answers do not match the number of questions" });
    }

    // Calculate the score and include questionId in answers
    let score = 0;
    const submissionAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      if (answer.selectedOption === question.correctAnswer) {
        score += 1;
      }
      return {
        questionId: question._id, // Include questionId
        selectedOption: answer.selectedOption,
      };
    });

    // Save the quiz submission
    const newSubmission = new QuizSubmission({
      quiz: req.params.quizId,
      student: req.user.id,
      answers: submissionAnswers,
      score,
    });

    await newSubmission.save();

    // Notify the user
    await notifyUser(req.user.id, `✅ Your quiz for "${quiz.title}" has been submitted.`);

    res.status(201).json({ message: "Quiz submitted successfully", score });
  } catch (error) {
    console.error("Error submitting quiz:", error.message, error.stack);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Get Student Quiz Submissions
router.get("/my-submissions", verifyToken, async (req, res) => {
  try {
    const submissions = await QuizSubmission.find({ student: req.user.id }).populate("quiz");
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error.message);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
