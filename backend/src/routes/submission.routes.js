// routes/submission.routes.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const fs = require("fs");
const Submission = require("../models/Submission");

const {
  uploadSubmission,
  getMySubmissions,
  getLecturerSubmissions,
  getSubmissionById,
  gradeSubmission,
  getSubmissionStats,
  markAsViewed,
  downloadSubmission,
  deleteSubmission,
  updateSubmissionStatus,
} = require("../controllers/submission.controller");

const { decryptSubmission } = require("../controllers/decrypt.controller");

// ==================== STUDENT ROUTES ====================
router.post(
  "/upload",
  protect,
  authorizeRoles("student"),
  upload.single("file"),
  uploadSubmission,
);

router.get(
  "/my-submissions",
  protect,
  authorizeRoles("student"),
  getMySubmissions,
);

// ==================== LECTURER ROUTES ====================
router.get(
  "/lecturer/submissions",
  protect,
  authorizeRoles("lecturer"),
  getLecturerSubmissions,
);

router.get(
  "/lecturer/stats",
  protect,
  authorizeRoles("lecturer"),
  getSubmissionStats,
);

router.post("/:id/grade", protect, authorizeRoles("lecturer"), gradeSubmission);
router.post("/:id/view", protect, authorizeRoles("lecturer"), markAsViewed);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("lecturer"),
  updateSubmissionStatus,
);

// ==================== CRYPTOGRAPHY ROUTES ====================
// Decrypt submission (lecturer only)
router.post(
  "/:id/decrypt",
  protect,
  authorizeRoles("lecturer"),
  decryptSubmission,
);

// Download decrypted file (lecturer only)
router.get(
  "/:id/download-decrypted",
  protect,
  authorizeRoles("lecturer"),
  async (req, res) => {
    try {
      const submission = await Submission.findById(req.params.id);
      if (!submission)
        return res.status(404).json({ message: "Submission not found" });
      if (submission.lecturer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }
      const decryptedPath =
        submission.filePath.replace(".enc", "") + "_decrypted";
      if (!fs.existsSync(decryptedPath)) {
        return res.status(404).json({ message: "Decrypted file not found" });
      }
      res.download(decryptedPath, submission.originalName);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// ==================== SHARED ROUTES ====================
// Download encrypted file (student or lecturer)
router.get("/:id/download", protect, async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // allow only owner OR lecturer
    const isStudentOwner =
      submission.student.toString() === req.user._id.toString();

    const isLecturerOwner =
      submission.lecturer.toString() === req.user._id.toString();

    if (!isStudentOwner && !isLecturerOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    return downloadSubmission(req, res, next);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
// Get submission by ID (student or lecturer with authorization)
router.get("/:id", protect, getSubmissionById);

// Delete submission (student or lecturer with authorization)
router.delete("/:id", protect, deleteSubmission);

module.exports = router;
