const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    encryptedKey: {
      type: String,
      required: true,
    },

    iv: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["submitted", "encrypted", "viewed"],
      default: "encrypted",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Submission", submissionSchema);
