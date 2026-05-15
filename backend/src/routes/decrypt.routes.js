const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const { decryptSubmission } = require("../controllers/decrypt.controller");

router.get("/:id", protect, authorizeRoles("lecturer"), decryptSubmission);

module.exports = router;
