const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const adminCertificateRoutes = require("./routes/adminCertificateRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");
const paymentRoutes = require("./routes/paymentRouters");
const errorHandler = require("./middleware/errorHandler");
const progressRoutes = require("./routes/progressRoutes");
const path = require("path");
const notificationRoutes = require("./routes/notificationRoutes");
const certificateRoutes = require("./routes/certificateRoutes"); // Add this line


dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/quizzes", quizRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes); // Add this line
app.use("/api/certificates", certificateRoutes); // Add this line
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/certificates", adminCertificateRoutes);
app.use("/api/student/dashboard", studentDashboardRoutes);
app.use("/api/payment", paymentRoutes);
app.use(errorHandler);
app.use("/api/notifications", notificationRoutes);






// Default Route
app.get("/", (req, res) => {
  res.send("🎉 EduMids API is running...");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});