const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { getActivity } = require("../controllers/activityController");

router.get("/:boardId", auth, getActivity);

module.exports = router;