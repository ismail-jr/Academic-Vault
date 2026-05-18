// routes/submission.routes.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

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
  getSubmissionByStudent,
} = require("../controllers/submission.controller");

const {
  decryptSubmission,
  downloadDecrypted,
} = require("../controllers/decrypt.controller");

// ==================== STUDENT ROUTES ====================

// Upload a new submission (encrypted server-side after upload)
router.post(
  "/upload",
  protect,
  authorizeRoles("student"),
  upload.single("file"),
  uploadSubmission,
);

// Get all submissions for the logged-in student
router.get(
  "/my-submissions",
  protect,
  authorizeRoles("student"),
  getMySubmissions,
);

// Get all submissions for a specific student (student can only view own)
router.get(
  "/student/:studentId/all",
  protect,
  authorizeRoles("student", "lecturer"),
  getSubmissionByStudent,
);
// ==================== LECTURER ROUTES ====================

// Get all submissions assigned to the logged-in lecturer
// Supports query params: ?status=&courseCode=&search=
router.get(
  "/lecturer/submissions",
  protect,
  authorizeRoles("lecturer"),
  getLecturerSubmissions,
);

// Get submission statistics for the lecturer
router.get(
  "/lecturer/stats",
  protect,
  authorizeRoles("lecturer"),
  getSubmissionStats,
);

// Grade a submission (adds grade + feedback, sets status to "graded")
router.post("/:id/grade", protect, authorizeRoles("lecturer"), gradeSubmission);

// Mark a submission as viewed (sets status to "viewed")
router.post("/:id/view", protect, authorizeRoles("lecturer"), markAsViewed);

// Update submission status manually
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("lecturer"),
  updateSubmissionStatus,
);

// ==================== CRYPTOGRAPHY ROUTES ====================

// Decrypt the submission — stores decrypted file on server (lecturer only)
router.post(
  "/:id/decrypt",
  protect,
  authorizeRoles("lecturer"),
  decryptSubmission,
);

// Download the decrypted file — must call /:id/decrypt first (lecturer only)
router.get(
  "/:id/download-decrypted",
  protect,
  authorizeRoles("lecturer"),
  downloadDecrypted,
);

// ==================== SHARED ROUTES ====================
// IMPORTANT: specific sub-paths above must be defined before the generic /:id routes

// Download file:
//   Student  → gets the encrypted .enc file
//   Lecturer → gets the decrypted file (only if /:id/decrypt was called first)
// Auth is handled inside downloadSubmission — no duplicate check needed here.
router.get("/:id/download", protect, downloadSubmission);

// Get a single submission by ID
// Student sees own submissions; lecturer sees submissions assigned to them
router.get("/:id", protect, getSubmissionById);

// Delete a submission
// Student can delete own; lecturer can delete submissions assigned to them
router.delete("/:id", protect, deleteSubmission);

module.exports = router;
