const mongoose = require("mongoose");

const boardSnapshotSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },

    version: {
      type: Number,
      required: true,
    },

    snapshotData: {
      type: Buffer,
      required: true,
    },

    isLatest: {
      type: Boolean,
      default: true,
    },

    trigger: {
      type: String,
      enum: ["auto_interval", "user_disconnect", "manual_save"],
      default: "auto_interval",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// fetch latest quickly
boardSnapshotSchema.index({ boardId: 1, isLatest: 1 });

// version history
boardSnapshotSchema.index({ boardId: 1, version: -1 });

module.exports = mongoose.model("BoardSnapshot", boardSnapshotSchema);