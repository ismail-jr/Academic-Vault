const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { uploadSubmission } = require("../controllers/submission.controller");

// ONLY students can upload
router.post(
  "/upload",
  protect,
  authorizeRoles("student"),
  upload.single("file"),
  uploadSubmission,
);

module.exports = router;
