const express = require("express");
const authMiddleware = require("../middleware/auth");

// Option A: If controllers are exported individually
const createBoard = require("../controllers/createBoard");
const { joinBoard } = require("../controllers/joinBoard");
const getBoards = require("../controllers/getBoards");
const getBoardById = require("../controllers/getBoardById");
const invite = require("../controllers/invite");
const getBoardUser = require("../controllers/getBoardUser");
const updateUserInBoard = require("../controllers/updateUserInBoard");
const deleteUserInBoard = require("../controllers/deleteUserBoard");


// Option B: If exported from a single boardController file
// const { createBoard, joinBoard } = require("../controllers/boardController");

const boardRouter = express.Router();

// POST /api/boards -> Create a new board
boardRouter.post("/", authMiddleware, createBoard);

// POST /api/boards/join -> Join an existing board via Room ID
boardRouter.post("/join", authMiddleware, joinBoard);
// GET /api/boards
boardRouter.get("/", authMiddleware, getBoards);
//GET /api/boards/:id
boardRouter.get('/:id',authMiddleware,getBoardById)

// GET /api/boards/:id/users
boardRouter.get('/:id',authMiddleware,getBoardUser)

// POST /api/boards/invite
boardRouter.get('/invite',authMiddleware,invite)

// PATCH /api/boards/:boardId/users/:userId
boardRouter.patch('/:boardId/users/:userId',authMiddleware,updateUserInBoard)
boardRouter.delete('/:boardId/users/:userId',authMiddleware,deleteUserInBoard)

module.exports = boardRouter;