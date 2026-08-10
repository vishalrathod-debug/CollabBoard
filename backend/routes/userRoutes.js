// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const updateProfile = require("../controllers/updateProfile");

router.put("/profile", authMiddleware, updateProfile);

module.exports = router;