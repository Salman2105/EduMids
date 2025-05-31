const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const auth = require("../middleware/auth");
const { registerValidation, loginValidation } = require("../validators/authValidator");
const { validationResult } = require("express-validator");
const notifyUser = require("../utils/notifyUser");

// 📝 Register a New User
router.post("/register", registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });

    await user.save();

    // Notify the user
    await notifyUser(user._id, "🎉 Welcome to EduMids! Start exploring courses now.");

    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
});

// 🛡 Login Route
router.post("/login", loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    await notifyUser(user._id, "👋 Welcome back to your  Dashboard.");

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🛡 Protected Route Example
router.get("/profile", auth, (req, res) => {
  res.json({ message: `Welcome ${req.user.id}!` });
});

// Example: Protected Admin Route
router.get("/admin/dashboard", verifyToken, checkRole(["admin"]), (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" });
});

// Example: Protected Teacher Route
router.post("/teacher/create-course", verifyToken, checkRole(["teacher"]), (req, res) => {
  res.json({ message: "Course created successfully" });
});

module.exports = router;
