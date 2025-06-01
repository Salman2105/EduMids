const express = require("express");
const router = express.Router();
const Enrollment = require("../Models/Enrollment");
const { Course } = require("../Models/course");
const { verifyToken, checkRole } = require("../middleware/authMiddleware"); // Correct import
const notifyUser = require("../utils/notifyUser");

// Middleware for auth & roles
router.use(verifyToken);

// 🟢 Enroll in a Course (Only Students)
router.post("/:courseId", checkRole(["student"]), async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Create new enrollment
    const newEnrollment = new Enrollment({
      student: req.user.id,
      course: courseId,
    });

    await newEnrollment.save();

    // Notify the user
    await notifyUser(req.user.id, `You have enrolled in the course: ${course.title}`);

    res.status(201).json({ message: "Enrollment successful!", enrollment: newEnrollment });
  } catch (error) {
    console.error("ENROLL ERROR:", error); // Add this line
    res.status(500).json({ message: "Error enrolling in course", error: error.message });
  }
});

// 🟡 Get All Enrollments for a Student
router.get("/enroll", checkRole(["student"]), async (req, res) => {
  try {
    // Find all enrollments for the student, populate course details
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({ path: "course", select: "title description lessons" });

    // Build the courses array for the frontend
    const courses = enrollments.map((enrollment) => {
      const course = enrollment.course;
      return {
        courseId: course._id,
        title: course.title,
        description: course.description,
        enrolledAt: enrollment.createdAt,
        progress: enrollment.progress || 0,
        lessons: Array.isArray(course.lessons)
          ? course.lessons.map((lesson) => ({
              lessonId: lesson._id || lesson.id || lesson,
              title: lesson.title || "Lesson",
            }))
          : [],
        quizzes: [], // You can fill this if you want to fetch quizzes for the course
      };
    });

    res.json({
      user: { id: req.user.id, role: req.user.role },
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollments", error: error.message });
  }
});

// 🔵 Get All Students Enrolled in a Course (For Teachers/Admins)
router.get("/course/:courseId", checkRole(["teacher", "admin"]), async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await Enrollment.find({ course: courseId }).populate("student", "name email");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course enrollments", error });
  }
});

// 🟠 Update Progress (Students Updating Their Progress)
router.put("/:courseId/progress", checkRole(["student"]), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;

    // Validate progress percentage
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: "Progress must be between 0 and 100" });
    }

    // Find enrollment
    const enrollment = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    // Update progress
    enrollment.progress = progress;
    await enrollment.save();

    res.json({ message: "Progress updated successfully!", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error });
  }
});

// 🔴 Unenroll from a Course
router.delete("/:courseId", checkRole(["student"]), async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOneAndDelete({
      student: req.user.id,
      course: courseId,
    });

    if (!enrollment) return res.status(404).json({ message: "Not enrolled in this course" });

    res.json({ message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unenrolling", error });
  }
});

module.exports = router;
