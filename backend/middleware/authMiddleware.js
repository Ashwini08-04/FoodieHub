const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required"
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Support both userId and id
    const userId = decoded.userId || decoded.id

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found in token"
      })
    }

    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      })
    }

    req.user = {
      userId: user._id,
      name: user.name,
      email: user.email
    }

    next()

  } catch (error) {
    console.log("AUTH ERROR:", error.message)

    return res.status(401).json({
      message: "Invalid or expired token"
    })
  }
}

module.exports = authMiddleware