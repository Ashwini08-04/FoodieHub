const { Order, User, Restaurant, Food } = require("../models")

// Calculate restaurant offer
const calculateOffer = (offer, subtotal) => {
  if (!offer) {
    return {
      discount: 0,
      offerApplied: null,
      freeDelivery: false
    }
  }

  const text = String(offer).toLowerCase()

  if (text.includes("free delivery")) {
    return {
      discount: 0,
      offerApplied: offer,
      freeDelivery: true
    }
  }

  const percentMatch = text.match(/(\d+)\s*%/)

  const maxDiscountMatch = text.match(
    /(?:up to|max|maximum)\s*₹?\s*(\d+)/i
  )

  const flatMatch = text.match(
    /₹\s*(\d+)\s*off/i
  )

  const minimumMatch = text.match(
    /(?:above|over|min(?:imum)?|on orders? above)\s*₹?\s*(\d+)/i
  )

  const minimumAmount = minimumMatch
    ? Number(minimumMatch[1])
    : 0

  if (
    minimumAmount > 0 &&
    subtotal < minimumAmount
  ) {
    return {
      discount: 0,
      offerApplied: null,
      freeDelivery: false
    }
  }

  let discount = 0

  if (percentMatch) {
    const percentage =
      Number(percentMatch[1])

    discount =
      (subtotal * percentage) / 100

    if (maxDiscountMatch) {
      discount = Math.min(
        discount,
        Number(maxDiscountMatch[1])
      )
    }
  }

  if (flatMatch) {
    discount = Number(flatMatch[1])
  }

  discount = Math.min(
    discount,
    subtotal
  )

  return {
    discount: Math.round(discount),
    offerApplied:
      discount > 0 ? offer : null,
    freeDelivery: false
  }
}

// Create new order
// Create new order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      address,
      city,
      phone
    } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "No items provided"
      })
    }

    // Resolve restaurant from food records
    const resolvedItems = []

    for (const item of items) {
      if (!item.food) {
        return res.status(400).json({
          message: "Food information is missing"
        })
      }

      const food = await Food.findByPk(item.food)

      if (!food) {
        return res.status(400).json({
          message: `Food not found: ${item.name || item.food}`
        })
      }

      const restaurantId =
        item.restaurantId ||
        item.restaurant?._id ||
        item.restaurant?.id ||
        food.restaurantId

      if (!restaurantId) {
        return res.status(400).json({
          message: `Restaurant information is missing for ${item.name || "food item"}`
        })
      }

      resolvedItems.push({
        food: item.food,
        name: item.name || food.name,
        category: item.category || food.category,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || Number(food.price) || 0,
        image: item.image || food.image,
        restaurantId,
        restaurantName: item.restaurantName || "",
        offer: item.offer || ""
      })
    }

    const restaurantIds = [
      ...new Set(
        resolvedItems
          .map((item) => item.restaurantId)
          .filter(Boolean)
      )
    ]

    const restaurants = await Restaurant.findAll({
      where: {
        id: restaurantIds
      }
    })

    if (restaurants.length !== restaurantIds.length) {
      return res.status(400).json({
        message: "One or more restaurants could not be found"
      })
    }

    // Build order items with verified restaurant data
    const orderItems = resolvedItems.map((item) => {
      const restaurant = restaurants.find(
        (restaurant) =>
          restaurant.id === item.restaurantId
      )

      return {
        ...item,
        restaurantName:
          restaurant?.name ||
          item.restaurantName ||
          "",
        offer:
          restaurant?.offer ||
          item.offer ||
          ""
      }
    })

    const subtotal = orderItems.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          Number(item.quantity),
      0
    )

    let totalDiscount = 0
    const offerApplied = []

    const restaurantTotals = {}

    orderItems.forEach((item) => {
      if (!restaurantTotals[item.restaurantId]) {
        restaurantTotals[item.restaurantId] = 0
      }

      restaurantTotals[item.restaurantId] +=
        Number(item.price) *
        Number(item.quantity)
    })

    Object.entries(restaurantTotals).forEach(
      ([restaurantId, restaurantSubtotal]) => {
        const restaurant = restaurants.find(
          (item) =>
            item.id === restaurantId
        )

        if (!restaurant) return

        const result = calculateOffer(
          restaurant.offer,
          restaurantSubtotal
        )

        totalDiscount += result.discount

        if (result.offerApplied) {
          offerApplied.push(
            result.offerApplied
          )
        }
      }
    )

    const deliveryFee = 0

    const totalAmount = Math.max(
      0,
      subtotal -
        totalDiscount +
        deliveryFee
    )

    const savedAddress = {
      address: address || "",
      city: city || "",
      phone: phone || ""
    }

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      subtotal,
      discount: totalDiscount,
      deliveryFee,
      totalAmount,
      offerApplied:
        offerApplied.length
          ? offerApplied.join(" • ")
          : null,
      deliveryAddress: savedAddress,
      status: "placed"
    })

    res.status(201).json({
      message: "Order placed successfully",
      order
    })
  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    )

    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    })
  }
}

// Get user's orders
const getUserOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.findAll({
        where: {
          userId: req.user.id
        },
        order: [
          ["createdAt", "DESC"]
        ]
      })

    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch orders",
      error: error.message
    })
  }
}

const getMyOrders = getUserOrders

// Get single order
const getOrderById = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findByPk(
        req.params.id
      )

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    if (
      req.user.role !== "admin" &&
      order.userId !== req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied"
      })
    }

    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch order",
      error: error.message
    })
  }
}

// Delete order
const deleteOrder = async (
  req,
  res
) => {
  try {
    const deleted =
      await Order.destroy({
        where: {
          id: req.params.id
        }
      })

    if (!deleted) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    res.status(200).json({
      message: "Order deleted"
    })
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to delete order",
      error: error.message
    })
  }
}

// Partner orders
const getPartnerOrders = async (
  req,
  res
) => {
  try {
    const restaurants =
      await Restaurant.findAll({
        where: {
          ownerId: req.user.id
        },
        attributes: [
          "id",
          "name"
        ]
      })

    const restaurantIds =
      restaurants.map(
        (restaurant) =>
          restaurant.id
      )

    if (!restaurantIds.length) {
      return res.status(200).json({
        orders: [],
        analytics: {
          revenue: 0,
          orders: 0,
          activeOrders: 0
        }
      })
    }

    const orders =
      await Order.findAll({
        order: [
          ["createdAt", "DESC"]
        ]
      })

    const partnerOrders =
      orders.filter((order) =>
        order.items.some(
          (item) =>
            restaurantIds.includes(
              item.restaurantId
            )
        )
      )

    const analytics =
      partnerOrders.reduce(
        (acc, order) => {
          const relevantItems =
            order.items.filter(
              (item) =>
                restaurantIds.includes(
                  item.restaurantId
                )
            )

          acc.revenue +=
            relevantItems.reduce(
              (sum, item) =>
                sum +
                Number(item.price) *
                  Number(item.quantity),
              0
            )

          acc.orders += 1

          if (
            [
              "placed",
              "confirmed",
              "preparing",
              "out for delivery"
            ].includes(order.status)
          ) {
            acc.activeOrders += 1
          }

          return acc
        },
        {
          revenue: 0,
          orders: 0,
          activeOrders: 0
        }
      )

    res.status(200).json({
      orders: partnerOrders,
      analytics,
      restaurants
    })
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch partner orders",
      error: error.message
    })
  }
}

// Admin orders
const getAllOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "name",
              "email"
            ]
          }
        ],
        order: [
          ["createdAt", "DESC"]
        ]
      })

    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch all orders",
      error: error.message
    })
  }
}

// Update order status
const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body

    const [updatedRows] =
      await Order.update(
        { status },
        {
          where: {
            id: req.params.id
          }
        }
      )

    if (!updatedRows) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    const order =
      await Order.findByPk(
        req.params.id
      )

    const io =
      req.app.get("io")

    if (io) {
      io.emit(
        "orderStatusUpdate",
        {
          orderId: order.id,
          status: order.status
        }
      )
    }

    res.status(200).json({
      message:
        "Order status updated",
      order
    })
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to update order status",
      error: error.message
    })
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getMyOrders,
  getOrderById,
  getPartnerOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
}