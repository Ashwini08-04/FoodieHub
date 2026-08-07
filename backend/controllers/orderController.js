const Order = require("../models/Order")

// Create order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      address,
      city,
      phone
    } = req.body

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      address,
      city,
      phone
    })

    res.status(201).json({
      message: "Order placed successfully",
      order
    })

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error)

    res.status(500).json({
      message: "Failed to place order",
      error: error.message
    })
  }
}


// Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const userId =
      req.user?.userId ||
      req.user?._id ||
      req.user?.id

    if (!userId) {
      return res.status(401).json({
        message: "User authentication failed"
      })
    }

    const orders = await Order.find({
      user: userId
    }).populate("items.food")

    res.status(200).json(orders)

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    })
  }
}


// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.food")

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    res.status(200).json(order)

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message
    })
  }
}


// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    )

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    res.status(200).json({
      message: "Order status updated",
      order
    })

  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message
    })
  }
}


// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(
      req.params.id
    )

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    res.status(200).json({
      message: "Order deleted successfully"
    })

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete order",
      error: error.message
    })
  }
}


module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
}