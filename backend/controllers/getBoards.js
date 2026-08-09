const BoardUserMeta = require("../models/BoardUserMeta");

const getBoards = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔹 Step 1: find all relations
    const relations = await BoardUserMeta.find({ userId })
      .populate("boardId")
      .sort({ updatedAt: -1 });

    // 🔹 Step 2: format response
    const boards = relations.map((item) => {
      return {
        _id: item.boardId._id,
        title: item.boardId.title,
        roomId: item.boardId.roomId,
        role: item.role,
        isStarred: item.isStarred,
        lastViewedAt: item.lastViewedAt,
      };
    });

    // 🔹 Step 3: response
    res.status(200).json({
      success: true,
      count: boards.length,
      boards,
    });

  } catch (error) {
    console.error("Get Boards Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = getBoards
