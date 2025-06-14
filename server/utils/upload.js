const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Configure Cloudinary storage for uploaded files
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "edumids";
    let resource_type = "auto";
    if (file.mimetype.startsWith("video/")) {
      folder = "edumids/videos";
      resource_type = "video";
    } else if (file.mimetype === "application/pdf") {
      folder = "edumids/pdfs";
      resource_type = "raw"; // <-- this is the key change
    }
    return {
      folder,
      resource_type,
      format: file.originalname.split(".").pop(),
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
