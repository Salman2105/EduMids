const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  contentType: { type: String, enum: ["video", "pdf", "quiz"], required: true },
  contentURL: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Check if the model already exists before defining it
module.exports = mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);
