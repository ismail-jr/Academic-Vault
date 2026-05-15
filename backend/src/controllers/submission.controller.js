const Submission = require("../models/Submission");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

const { encryptFile, encryptAESKey } = require("../services/crypto.service");

exports.uploadSubmission = async (req, res) => {
  try {
    const { lecturerId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // find lecturer public key
    const lecturer = await User.findById(lecturerId);
    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" });
    }

    const inputPath = req.file.path;
    const encryptedPath = inputPath + ".enc";

    // AES encrypt file
    const { key, iv } = await encryptFile(inputPath, encryptedPath);

    // RSA encrypt AES key
    const encryptedKey = encryptAESKey(key, lecturer.publicKey);

    // delete original file (important)
    fs.unlinkSync(inputPath);

    const submission = await Submission.create({
      student: req.user._id,
      lecturer: lecturerId,
      filePath: encryptedPath,
      originalName: req.file.originalname,
      encryptedKey,
      iv,
    });

    res.status(201).json({
      message: "File encrypted and uploaded",
      submission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
