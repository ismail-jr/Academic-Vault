// controllers/submission.controller.js
const Submission = require("../models/Submission");
const User = require("../models/User");
const fs = require("fs");
const { encryptFile, encryptAESKey } = require("../services/crypto.service");

exports.uploadSubmission = async (req, res) => {
  try {
    const { lecturerId, courseCode, courseName, assignmentTitle, description } =
      req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const lecturer = await User.findById(lecturerId);
    if (!lecturer || !lecturer.publicKey) {
      return res.status(400).json({
        success: false,
        message: "Lecturer not properly configured",
      });
    }

    const inputPath = req.file.path;
    const encryptedPath = inputPath + ".enc";

    // STEP 1: Encrypt file
    const { key, iv } = await encryptFile(inputPath, encryptedPath);

    // STEP 2: Encrypt AES key with RSA
    const encryptedKey = encryptAESKey(key, lecturer.publicKey);

    // Remove original file
    fs.unlinkSync(inputPath);

    const submission = await Submission.create({
      student: req.user._id,
      lecturer: lecturerId,
      filePath: encryptedPath,
      originalName: req.file.originalname,
      encryptedKey,
      iv,
      courseCode: courseCode || null,
      courseName: courseName || null,
      assignmentTitle,
      description: description || "",
      status: "encrypted",
    });

    await submission.populate("lecturer", "name email");

    res.status(201).json({
      success: true,
      message: "File encrypted and uploaded successfully",

      //  NEW: security info for UI
      security: {
        steps: [
          "File received",
          "Encrypted with AES-256",
          "AES key encrypted with RSA",
          "Stored securely",
        ],
        algorithm: "AES-256 + RSA",
        status: "encrypted",
      },

      submission: {
        _id: submission._id,
        originalName: submission.originalName,
        assignmentTitle: submission.assignmentTitle,
        courseCode: submission.courseCode,
        courseName: submission.courseName,
        status: submission.status,
        createdAt: submission.createdAt,
        lecturer: submission.lecturer,
      },
    });
  } catch (error) {
    console.error("Upload submission error:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload submission",
    });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate("lecturer", "name email")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    console.error("Get my submissions error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch submissions",
    });
  }
};

exports.getLecturerSubmissions = async (req, res) => {
  try {
    const { status, courseCode, search } = req.query;
    let query = { lecturer: req.user._id };

    if (status && status !== "all") query.status = status;
    if (courseCode && courseCode !== "all") query.courseCode = courseCode;

    let submissionsQuery = Submission.find(query)
      .populate("student", "name email studentId phone")
      .populate("lecturer", "name email")
      .sort({ createdAt: -1 });

    if (search) {
      const searchRegex = new RegExp(search, "i");
      submissionsQuery = submissionsQuery.or([
        { assignmentTitle: searchRegex },
        { courseCode: searchRegex },
        { courseName: searchRegex },
        { "student.name": searchRegex },
        { "student.studentId": searchRegex },
      ]);
    }

    const submissions = await submissionsQuery;
    res
      .status(200)
      .json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    console.error("Get lecturer submissions error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch submissions",
    });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id)
      .populate("student", "name email studentId phone")
      .populate("lecturer", "name email");

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    const isStudent =
      submission.student._id.toString() === req.user._id.toString();
    const isLecturer =
      submission.lecturer._id.toString() === req.user._id.toString();

    if (!isStudent && !isLecturer) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this submission",
      });
    }

    res.status(200).json({
      success: true,
      submission,

      //  NEW
      security: {
        encrypted: submission.status === "encrypted",
        algorithm: "AES-256 + RSA",
        access: isLecturer ? "Can decrypt" : "Cannot decrypt",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    if (grade === undefined || grade < 0 || grade > 100) {
      return res
        .status(400)
        .json({ success: false, message: "Grade must be between 0 and 100" });
    }

    const submission = await Submission.findById(id);
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }
    if (submission.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to grade this submission",
      });
    }

    await submission.addGrade(grade, feedback);

    res.status(200).json({
      success: true,
      message: "Grade added successfully",
      submission: {
        _id: submission._id,
        grade: submission.grade,
        feedback: submission.feedback,
        status: submission.status,
        gradedAt: submission.gradedAt,
      },
    });
  } catch (error) {
    console.error("Grade submission error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to grade submission",
    });
  }
};

exports.markAsViewed = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }
    if (submission.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this submission",
      });
    }

    const marked = await submission.markAsViewed();

    res.status(200).json({
      success: true,
      message: marked
        ? "Submission marked as viewed"
        : "Submission already viewed",
      submission: {
        _id: submission._id,
        status: submission.status,
        viewedAt: submission.viewedAt,
      },
    });
  } catch (error) {
    console.error("Mark as viewed error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to mark submission as viewed",
    });
  }
};

exports.getSubmissionStats = async (req, res) => {
  try {
    const stats = await Submission.aggregate([
      { $match: { lecturer: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          averageGrade: { $avg: "$grade" },
        },
      },
    ]);

    const courseStats = await Submission.aggregate([
      { $match: { lecturer: req.user._id } },
      {
        $group: {
          _id: "$courseCode",
          count: { $sum: 1 },
          gradedCount: {
            $sum: { $cond: [{ $eq: ["$status", "graded"] }, 1, 0] },
          },
          averageGrade: { $avg: "$grade" },
        },
      },
    ]);

    const recentActivity = await Submission.find({ lecturer: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate("student", "name")
      .select("status assignmentTitle updatedAt");

    res.status(200).json({
      success: true,
      stats,
      courseStats,
      recentActivity,
      summary: {
        total: stats.reduce((acc, s) => acc + s.count, 0),
        pending:
          stats.find((s) => s._id === "encrypted" || s._id === "submitted")
            ?.count || 0,
        viewed: stats.find((s) => s._id === "viewed")?.count || 0,
        graded: stats.find((s) => s._id === "graded")?.count || 0,
      },
    });
  } catch (error) {
    console.error("Get submission stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch statistics",
    });
  }
};

exports.downloadSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    const isStudent = submission.student.toString() === req.user._id.toString();

    const isLecturer =
      submission.lecturer.toString() === req.user._id.toString();

    if (!isStudent && !isLecturer) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // BOTH student and lecturer get encrypted file here
    return res.download(
      submission.filePath,
      `${submission.originalName || "encrypted-file"}.enc`,
    );
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    const isStudent = submission.student.toString() === req.user._id.toString();
    const isLecturer =
      submission.lecturer.toString() === req.user._id.toString();

    if (!isStudent && !isLecturer) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this submission",
      });
    }

    if (submission.filePath && fs.existsSync(submission.filePath)) {
      fs.unlinkSync(submission.filePath);
    }

    // Remove temporary decrypted file too
    const decryptedPath =
      submission.filePath.replace(".enc", "") + "_decrypted";

    if (fs.existsSync(decryptedPath)) {
      fs.unlinkSync(decryptedPath);
    }

    await submission.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Delete submission error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete submission",
    });
  }
};

exports.getSubmissionByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === "student" && req.user._id.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view another student's submissions",
      });
    }

    const submissions = await Submission.find({ student: studentId })
      .populate("lecturer", "name email")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    console.error("Get submission by student error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch submissions",
    });
  }
};

exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["encrypted", "submitted", "viewed", "graded", "returned"];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(", ")}`,
      });
    }

    const submission = await Submission.findById(id);
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }
    if (submission.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this submission",
      });
    }

    submission.status = status;
    await submission.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      submission: {
        _id: submission._id,
        status: submission.status,
        updatedAt: submission.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update submission status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update status",
    });
  }
};
