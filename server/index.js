const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const TeacherRoutes = require("./routes/TeacherRoutes");
const StudentRoutes = require("./routes/studentroutes"); // Fix import casing
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const adminCertificateRoutes = require("./routes/adminCertificateRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const TeacherDashboardRoutes = require("./routes/TeacherDashboardRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");
const paymentRoutes = require("./routes/paymentRouters");
const errorHandler = require("./middleware/errorHandler");
const progressRoutes = require("./routes/progressRoutes");
const path = require("path");
const notificationRoutes = require("./routes/notificationRoutes");
const certificateRoutes = require("./routes/certificateRoutes"); // Add this line
const QnaRoutes = require("./routes/qnas"); // Import Q&A routes
const contactRoutes = require("./routes/contactRoutes"); // Import contact routes
const impactRoutes = require("./routes/impact"); // Import impact routes
const downloadRoutes = require("./routes/download"); // Import download routes
const assignmentRoutes = require("./routes/assignmentRoutes"); // Import assignment routes
const submissionRoutes = require("./routes/submissionRoutes"); // Import submission routes

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Connect to MongoDB
connectDB();

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", TeacherRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes); 
app.use("/api/certificates", certificateRoutes); 
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/teacher/dashboard", TeacherDashboardRoutes);
app.use("/api/student/dashboard", studentDashboardRoutes);
app.use("/api/student", StudentRoutes); 
app.use("/api/admin/certificates", adminCertificateRoutes);
app.use("/api/payment", paymentRoutes);
app.use(errorHandler);
app.use("/api/notifications", notificationRoutes);
app.use("/api/qna", QnaRoutes); // Use Q&A routes
app.use("/api/contact", contactRoutes); // Use contact routes
app.use("/api/impact", impactRoutes); // Use impact routes at correct path
app.use("/api/download", downloadRoutes); // Use download routes
app.use("/api/assignments", assignmentRoutes); // Use assignment routes
app.use("/api/submissions", submissionRoutes); // Use submission routes


// In your main server file (index.js or server.js)



// Default Route
app.get("/", (req, res) => {
  res.send("🎉 EduMids API is running...");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});