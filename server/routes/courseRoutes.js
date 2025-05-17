const express = require("express");
const router = express.Router();
const Course = require("../Models/course"); // Ensure the correct path to the Course model
const { verifyToken, checkRole } = require("../middleware/authMiddleware"); // Ensure the correct path to the middleware
const { createCourseValidation } = require("../validators/courseValidator");
const { validationResult } = require("express-validator");

// Middleware to verify token
router.use(verifyToken);

// 🟢 Create a Course (Only Teachers/Admins)
router.post("/create", createCourseValidation, checkRole(["teacher", "admin"]), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description } = req.body;

    // Check if title and description are provided
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newCourse = new Course({
      title,
      description,
      createdBy: req.user.id, // Logged-in user (teacher/admin)
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully!", course: newCourse });
  } catch (error) {
    console.error("Error creating course:", error); // Log the error for debugging
    res.status(500).json({ message: "Error creating course", error });
  }
});

// 🟡 Get All Courses (For Students)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("createdBy", "name email");
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error); // Log the error for debugging
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// 🔵 Get Single Course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("createdBy", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error); // Log the error for debugging
    res.status(500).json({ message: "Error fetching course" });
  }
});

// 🟠 Update a Course (Only the Creator or Admin)
router.put("/:id", checkRole(["teacher", "admin"]), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only the creator (teacher) or admin can update
    if (course.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;

    await course.save();
    res.json({ message: "Course updated successfully!", course });
  } catch (error) {
    console.error("Error updating course:", error); // Log the error for debugging
    res.status(500).json({ message: "Error updating course" });
  }
});

// 🔴 Delete a Course (Only the Creator or Admin)
router.delete("/:id", checkRole(["teacher", "admin"]), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only the creator (teacher) or admin can delete
    if (course.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully!" });
  } catch (error) {
    console.error("Error deleting course:", error); // Log the error for debugging
    res.status(500).json({ message: "Error deleting course" });
  }
});

module.exports = router;
