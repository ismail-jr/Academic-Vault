const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Helper function to validate phone number
const validatePhoneNumber = (phone) => {
  // Basic international phone number validation
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

// Helper function to format phone number (optional)
const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters except '+'
  let cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned;
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, studentId, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({
        message:
          "Missing required fields: name, email, password, role, phone are required",
      });
    }

    // Validate phone number format
    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({
        message:
          "Invalid phone number format. Please enter a valid phone number",
      });
    }

    // Check if user exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Check if phone number already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    // For students, validate student ID
    if (role === "student") {
      if (!studentId) {
        return res
          .status(400)
          .json({ message: "Student ID is required for student accounts" });
      }

      const existingStudentId = await User.findOne({ studentId });
      if (existingStudentId) {
        return res.status(400).json({ message: "Student ID already exists" });
      }
    }

    // For lecturers, ensure studentId is not provided
    if (role === "lecturer" && studentId) {
      return res
        .status(400)
        .json({ message: "Lecturers cannot have a student ID" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate RSA key pair for encryption
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: formattedPhone,
      password: hashedPassword,
      role,
      studentId:
        role === "student" ? studentId.toUpperCase().trim() : undefined,
      publicKey,
      privateKey,
    });

    // Return user data without sensitive information
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        studentId: user.studentId || null,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === "email") {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (field === "phone") {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      if (field === "studentId") {
        return res.status(400).json({ message: "Student ID already exists" });
      }
    }

    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Identifier (email/student ID) and password are required",
      });
    }

    // Find user by email or student ID
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { studentId: identifier.toUpperCase().trim() },
      ],
      isActive: true, // Only allow active users to login
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Return user data without sensitive information
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        studentId: user.studentId || null,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Login failed" });
  }
};

// GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -privateKey",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();

    if (phone) {
      if (!validatePhoneNumber(phone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }

      const existingPhone = await User.findOne({
        phone,
        _id: { $ne: req.user.id },
      });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already in use" });
      }

      updates.phone = formatPhoneNumber(phone);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password -privateKey");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: error.message });
  }
};
