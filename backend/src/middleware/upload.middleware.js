const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "secure-submissions",
    resource_type: "raw",
    allowed_formats: ["pdf", "doc", "docx", "txt", "zip"],
  },
});

const upload = multer({ storage });

module.exports = upload;
