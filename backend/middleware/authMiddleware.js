const jwt = require("jsonwebtoken")
const { User } = require("../models")

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId || decoded.id

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" })
    }

    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } })
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    next()
  } catch (error) {
    console.log("AUTH ERROR:", error.message)
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    return res.status(403).json({ message: "Access denied: Admins only" })
  }
}

module.exports = { isAuth, isAdmin }