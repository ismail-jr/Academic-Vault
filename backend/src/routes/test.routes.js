const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/auth.middleware");

router.get("/student-area", protect, authorizeRoles("student"), (req, res) => {
  res.json({ message: "Welcome student", user: req.user });
});

router.get(
  "/lecturer-area",
  protect,
  authorizeRoles("lecturer"),
  (req, res) => {
    res.json({ message: "Welcome lecturer", user: req.user });
  },
);

module.exports = router;
