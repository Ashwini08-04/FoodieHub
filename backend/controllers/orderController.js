const { Order, User } = require("../models");

// Create new order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      status: "placed"
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, as: "user", attributes: ["name", "email"] }],
      order: [["createdAt", "DESC"]]
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders", error: error.message });
  }
};

// Update order status (Admin endpoint)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const [updatedRows] = await Order.update(
      { status },
      { where: { id: req.params.id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = await Order.findByPk(req.params.id);

    // Emit socket event for real-time tracking
    const io = req.app.get("io");
    if (io) {
      io.emit("orderStatusUpdate", { orderId: order.id, status: order.status });
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};