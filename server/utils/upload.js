const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Configure Cloudinary storage for uploaded files
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "edumids",
      resource_type: file.mimetype.startsWith("video/") ? "video" : "auto", // handles video, image, pdf
      format: file.originalname.split(".").pop(), // preserve extension
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
