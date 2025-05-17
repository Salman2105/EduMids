const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson", // Reference to the Lesson model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CourseProgressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], // Track completed lessons
}, { timestamps: true });

module.exports = mongoose.model("CourseProgress", CourseProgressSchema);


module.exports = mongoose.model("Course", CourseSchema);
