// routes/user.routes.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const {
  getLecturers,
  getLecturerById,
} = require("../controllers/user.controller");

// Get all lecturers (accessible to authenticated students)
router.get("/lecturers", protect, authorizeRoles("student"), getLecturers);

// Get single lecturer by ID
router.get(
  "/lecturers/:id",
  protect,
  authorizeRoles("student"),
  getLecturerById,
);

module.exports = router;
