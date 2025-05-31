const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const Enrollment = require("../Models/Enrollment");
const { Course } = require("../Models/course");
const { issueCertificateValidation } = require("../validators/certificateValidator");
const { validationResult } = require("express-validator");
const notifyUser = require("../utils/notifyUser");

// ✅ Issue Certificate for Completed Course (Teacher can issue to any student)
router.post("/issue", auth, issueCertificateValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { courseId, studentId } = req.body;

    // Only allow teachers to issue certificates for their own courses
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Optionally, check if req.user is a teacher and is the creator of the course
    if (req.user.role !== "teacher" || course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if the student has completed the course
    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment || enrollment.progress < 100) {
      return res.status(400).json({ message: "Course not completed yet" });
    }

    // Mark certificate as issued
    enrollment.certificateIssued = true;
    await enrollment.save();

    // Notify the student
    await notifyUser(studentId, `🎉 Your certificate for the course "${course.title}" is now available.`);

    res.status(200).json({ message: "Certificate issued successfully!" });
  } catch (error) {
    console.error("Error issuing certificate:", error.message);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Generate and Download Certificate
router.get("/certificate/:courseId", auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if user has completed the course
    const enrollment = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!enrollment || enrollment.progress < 100) {
      return res.status(400).json({ message: "Course not completed yet" });
    }

    const course = await Course.findById(courseId);

    // Generate PDF Certificate
    const doc = new PDFDocument();
    const filename = `Certificate-${req.user.name}-${course.title}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(26).text("Certificate of Completion", { align: "center" });
    doc.moveDown();

    doc.fontSize(20).text(`This is to certify that`, { align: "center" });
    doc.fontSize(22).text(`${req.user.name}`, { align: "center", underline: true });
    doc.moveDown();

    doc.fontSize(18).text(`has successfully completed the course`, { align: "center" });
    doc.fontSize(22).text(`"${course.title}"`, { align: "center", underline: true });
    doc.moveDown();

    doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Get All Certificates for Logged-in Student
router.get("/my-certificates", auth, async (req, res) => {
  try {
    // Find all enrollments where the user is the student and certificateIssued is true
    const enrollments = await Enrollment.find({
      student: req.user.id,
      certificateIssued: true
    }).populate("course");

    // Map to certificate details
    const certificates = enrollments.map(enrollment => ({
      certificateId: enrollment._id,
      courseName: enrollment.course?.title || "Unknown Course",
      organization: enrollment.course?.organization || "EduMids",
      dateEarned: enrollment.updatedAt || enrollment.createdAt,
      courseId: enrollment.course?._id
    }));

    res.status(200).json({ certificates });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
