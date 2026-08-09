const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Board",
      maxlength: 100,
    },

    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 4,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    currentVersion: {
      type: Number,
      default: 1,
    },

    // 🔥 CRITICAL (for YJS persistence)
    documentState: {
      type: Buffer,
      default: null,
    },

    canvasState: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ objects: [] }),
    },
  },
  { timestamps: true }
);

// 🔥 Optimized index (dashboard queries)
boardSchema.index({ ownerId: 1, updatedAt: -1 });

module.exports = mongoose.model("Board", boardSchema);
