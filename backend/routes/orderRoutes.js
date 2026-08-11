const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
} = require("../controllers/orderController");

const { isAuth, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// User Routes
router.post("/", isAuth, createOrder);
router.get("/my-orders", isAuth, getMyOrders);
router.get("/:id", isAuth, getOrderById);

// Admin Routes
router.get("/admin/all", isAuth, isAdmin, getAllOrders);
router.put("/:id/status", isAuth, isAdmin, updateOrderStatus);
router.delete("/:id", isAuth, isAdmin, deleteOrder);

module.exports = router;