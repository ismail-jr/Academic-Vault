// controllers/decrypt.controller.js
const Submission = require("../models/Submission");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

const { decryptAESKey, decryptFile } = require("../services/crypto.service");

// POST /:id/decrypt
// Decrypts the submission file and stores it server-side temporarily
exports.decryptSubmission = async (req, res) => {
  try {
    const submissionId = req.params.id;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    if (submission.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // if already decrypted → just return success (NO reprocessing)
    if (submission.isDecrypted) {
      return res.status(200).json({
        success: true,
        message: "Already decrypted",
        downloadUrl: `/api/submissions/${submissionId}/download-decrypted`,
        steps: ["Previously decrypted", "Ready for download"],
      });
    }

    const lecturer = await User.findById(req.user._id);
    if (!lecturer || !lecturer.privateKey) {
      return res.status(400).json({
        success: false,
        message: "Lecturer private key not found",
      });
    }

    if (!fs.existsSync(submission.filePath)) {
      return res.status(404).json({
        success: false,
        message: "Encrypted file not found on server",
      });
    }

    const aesKey = decryptAESKey(submission.encryptedKey, lecturer.privateKey);

    const decryptedPath =
      submission.filePath.replace(".enc", "") + "_decrypted";

    await decryptFile(
      submission.filePath,
      decryptedPath,
      aesKey,
      submission.iv,
    );

    // PERMANENT STATE AFTER REFRESH
    submission.isDecrypted = true;
    submission.decryptedAt = new Date();
    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Decryption successful",
      steps: [
        "Encrypted AES key retrieved",
        "RSA decryption completed",
        "AES file decrypted",
        "Ready for download",
      ],
      downloadUrl: `/api/submissions/${submissionId}/download-decrypted`,
    });
  } catch (error) {
    console.error("Decrypt submission error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /:id/download-decrypted
// Streams the already-decrypted file to the lecturer and cleans up after
exports.downloadDecrypted = async (req, res) => {
  try {
    const submissionId = req.params.id;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    if (submission.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!submission.isDecrypted) {
      return res.status(400).json({
        success: false,
        message: "File not decrypted yet. Please decrypt first.",
      });
    }

    const decryptedPath =
      submission.filePath.replace(".enc", "") + "_decrypted";

    if (!fs.existsSync(decryptedPath)) {
      return res.status(400).json({
        success: false,
        message: "Decrypted file missing on server",
      });
    }

    return res.download(decryptedPath, submission.originalName);
  } catch (error) {
    console.error("Download decrypted error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
