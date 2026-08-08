const Board = require("../models/Board");
const BoardUserMeta = require("../models/BoardUserMeta");
const { nanoid } = require("nanoid");

// @route   POST /api/boards
// @access  Private
const createBoard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;

    // 🔹 1. Validation
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Board title is required",
      });
    }

    // 🔹 2. Create Board
    const board = await Board.create({
      title: title.trim(),
      ownerId: userId,
      roomId: nanoid(8), // short unique id
    });

    // 🔹 3. Create User-Board relationship (CRITICAL)
    await BoardUserMeta.create({
      userId,
      boardId: board._id,
      role: "admin", // creator is admin
    });

    // 🔹 4. Response
    res.status(201).json({
      success: true,
      message: "Board created successfully",
      board,
    });

  } catch (error) {
    console.error("Create Board Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = createBoard