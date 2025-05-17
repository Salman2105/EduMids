const { body } = require("express-validator");

exports.lessonValidation = [
  body("title").notEmpty().withMessage("Lesson title is required"),
  // body("content").notEmpty().withMessage("Lesson content is required"),
  body("courseId").notEmpty().withMessage("Associated course ID is required"),
];
