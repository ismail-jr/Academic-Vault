// controllers/user.controller.js
const User = require("../models/User");

// Get all lecturers (for students to select)
exports.getLecturers = async (req, res) => {
  try {
    const lecturers = await User.find(
      { role: "lecturer", isActive: true },
      "name email _id",
    ).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: lecturers.length,
      lecturers,
    });
  } catch (error) {
    console.error("Get lecturers error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch lecturers",
    });
  }
};

// Get single lecturer by ID
exports.getLecturerById = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturer = await User.findById(id).select("name email _id");

    if (!lecturer || lecturer.role !== "lecturer") {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found",
      });
    }

    res.status(200).json({
      success: true,
      lecturer,
    });
  } catch (error) {
    console.error("Get lecturer by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch lecturer",
    });
  }
};
