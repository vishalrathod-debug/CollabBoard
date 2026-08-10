const BoardActivity = require("../models/BoardActivity");

const logActivity = async ({
  boardId,
  userId,
  action,
  meta = {},
}) => {
  try {
    if (!boardId || !userId || !action) return;

    await BoardActivity.create({
      boardId,
      userId,
      action,
      meta,
    });

  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};

module.exports = logActivity;