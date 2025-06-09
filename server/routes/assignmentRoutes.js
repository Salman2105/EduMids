const express = require("express");
const Lesson = require("../Models/lesson");
const { Course } = require("../Models/course");
const auth = require("../middleware/auth");
const upload = require("../utils/upload");
const notifyUser = require("../utils/notifyUser");
const Assignment = require("../Models/Assignment.js");
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

// @route   POST /api/assignments
// @desc    Teacher creates a new assignment
router.post("/", verifyToken, checkRole(["teacher"]), async (req, res) => {
  try {
    const { title, description, course, deadline, totalMarks, attachmentUrl } = req.body;
    const assignment = await Assignment.create({
      title,
      description,
      course,
      deadline,
      totalMarks,
      attachmentUrl,
      createdBy: req.user.id,
    });
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating assignment", error });
  }
});

// @route   GET /api/assignments/course/:courseId
// @desc    Get all assignments for a course
router.get("/course/:courseId", verifyToken, checkRole(["teacher"]), async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ course: courseId }).sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch assignments", error });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get single assignment
router.get("/:id", verifyToken, checkRole(["teacher"]), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching assignment", error });
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update assignment
router.put("/:id", verifyToken, checkRole(["teacher"]), async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, assignment: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating assignment", error });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
router.delete("/:id", verifyToken, checkRole(["teacher"]), async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting assignment", error });
  }
});

module.exports = router;
