const express = require("express")
const {
  registerUser,
  loginUser,
  adminLoginUser
} = require("../controllers/authController")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/admin/login", adminLoginUser)

module.exports = router