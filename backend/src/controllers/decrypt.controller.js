const Submission = require("../models/Submission");
const User = require("../models/User");
const fs = require("fs");

const { decryptAESKey, decryptFile } = require("../services/crypto.service");

exports.decryptSubmission = async (req, res) => {
  try {
    const submissionId = req.params.id;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const lecturer = await User.findById(req.user._id);

    // STEP 1
    const aesKey = decryptAESKey(submission.encryptedKey, lecturer.privateKey);

    // STEP 2
    const decryptedPath =
      submission.filePath.replace(".enc", "") + "_decrypted";

    await decryptFile(
      submission.filePath,
      decryptedPath,
      aesKey,
      submission.iv,
    );

    // 🔐 NEW: send steps before download
    return res.status(200).json({
      success: true,
      message: "Decryption successful",
      steps: [
        "Encrypted AES key retrieved",
        "AES key decrypted using RSA private key",
        "File decrypted using AES",
        "File ready for download",
      ],
      downloadUrl: `/api/submissions/${submissionId}/download-decrypted`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
