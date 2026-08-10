const mongoose = require("mongoose");

const boardActivitySchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE_BOARD",
        "RENAME_BOARD",
        "DELETE_BOARD",
        "INVITE_MEMBER",
        "REMOVE_MEMBER",
        "ROLE_CHANGE",
        "CANVAS_UPDATE",
      ],
    },
    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BoardActivity", boardActivitySchema);