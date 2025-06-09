const express = require("express");
const Submission = require("../Models/AssignmentSubmission");
const Assignment = require("../Models/Assignment");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.js");
const router = express.Router();

// Middleware to verify user token (CommonJS style)
const verifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "Access Denied" });
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: "Access Forbidden" });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access Forbidden" });
  }
  next();
};

// POST: Student submits an assignment
router.post("/", verifyToken, checkRole(["student"]), async (req, res) => {
  try {
    const { assignment, submittedFileUrl } = req.body;

    // Check for duplicate submission
    const existing = await Submission.findOne({ assignment, student: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already submitted this assignment." });
    }

    const submission = await Submission.create({
      assignment,
      submittedFileUrl,
      student: req.user.id,
    });

    res.status(201).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: "Submission failed", error });
  }
});

// GET: Student gets all their submissions
router.get("/student", verifyToken, checkRole(["student"]), async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id }).populate("assignment");
    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching submissions", error });
  }
});

// GET: Teacher gets all submissions for a specific assignment
router.get("/assignment/:assignmentId", verifyToken, checkRole(["teacher"]), async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await Submission.find({ assignment: assignmentId }).populate("student", "name email");
    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching submissions", error });
  }
});

// PUT: Grade a submission
router.put("/:id/grade", verifyToken, checkRole(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { marksObtained, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      id,
      { marksObtained, feedback },
      { new: true }
    );

    res.json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: "Grading failed", error });
  }
});

module.exports = router;
