const express = require("express");
const { handleChat } = require("../controllers/chatController");
const { isAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", isAuth, handleChat);

module.exports = router;
