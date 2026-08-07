const express = require("express")

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require("../controllers/orderController")

const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/", authMiddleware, createOrder)

router.get("/my-orders", authMiddleware, getMyOrders)

router.get("/:id", authMiddleware, getOrderById)

router.put("/:id/status", authMiddleware, updateOrderStatus)

router.delete("/:id", authMiddleware, deleteOrder)

module.exports = router