const mongoose = require("mongoose");

const boardUserMetaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "editor",
    },

    isStarred: {
      type: Boolean,
      default: false,
    },

    isTrashed: {
      type: Boolean,
      default: false,
    },

    lastViewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 🔥 CRITICAL: prevent duplicate user per board
boardUserMetaSchema.index(
  { userId: 1, boardId: 1 },
  { unique: true }
);

// 🔥 OPTIMIZATION: fetch all users of a board fast
boardUserMetaSchema.index({ boardId: 1, role: 1 });

module.exports = mongoose.model("BoardUserMeta", boardUserMetaSchema);