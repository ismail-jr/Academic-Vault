// models/Submission.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Lecturer is required"],
    },
    filePath: {
      type: String,
      required: [true, "File path is required"],
    },
    originalName: {
      type: String,
      required: [true, "Original file name is required"],
    },
    encryptedKey: {
      type: String,
      required: [true, "Encrypted key is required"],
    },
    iv: {
      type: String,
      required: [true, "Initialization vector is required"],
    },
    status: {
      type: String,
      enum: ["submitted", "encrypted", "viewed", "graded"],
      default: "encrypted",
    },
    courseCode: {
      type: String,
      trim: true,
      uppercase: true,
      index: true,
    },
    courseName: {
      type: String,
      trim: true,
      index: true,
    },
    assignmentTitle: {
      type: String,
      trim: true,
      required: [true, "Assignment title is required"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    grade: {
      type: Number,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
      trim: true,
    },
    gradedAt: Date,
    viewedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
submissionSchema.index({ student: 1, createdAt: -1 });
submissionSchema.index({ lecturer: 1, status: 1 });
submissionSchema.index({ courseCode: 1, assignmentTitle: 1 });
submissionSchema.index({ createdAt: -1 });

// Virtuals
submissionSchema.virtual("ageDays").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

submissionSchema.virtual("gradePercentage").get(function () {
  return this.grade ? `${this.grade}%` : "Not graded";
});

// Methods
submissionSchema.methods.markAsViewed = async function () {
  if (this.status === "encrypted" || this.status === "submitted") {
    this.status = "viewed";
    this.viewedAt = new Date();
    await this.save();
    return true;
  }
  return false;
};

submissionSchema.methods.addGrade = async function (grade, feedback) {
  this.grade = grade;
  this.feedback = feedback;
  this.status = "graded";
  this.gradedAt = new Date();
  await this.save();
  return this;
};

submissionSchema.methods.isPending = function () {
  return this.status === "submitted" || this.status === "encrypted";
};

// Static methods
submissionSchema.statics.getLecturerStats = async function (lecturerId) {
  return this.aggregate([
    { $match: { lecturer: mongoose.Types.ObjectId(lecturerId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        averageGrade: { $avg: "$grade" },
      },
    },
  ]);
};

module.exports = mongoose.model("Submission", submissionSchema);
