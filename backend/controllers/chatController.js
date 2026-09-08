const axios = require("axios")
const { Restaurant, Food, Order } = require("../models")

// AI prompt
const buildSystemPrompt = (restaurants, foods, orders, history = []) => {
  const restaurantData = restaurants.map((r) => ({
    name: r.name,
    category: r.category,
    rating: Number(r.rating),
    offer: r.offer,
    address: r.address || ""
  }))

  const foodData = foods.map((f) => ({
    restaurant: f.restaurant?.name || "",
    name: f.name,
    category: f.category,
    price: Number(f.price),
    rating: Number(f.rating || 4.5),
    description: f.description || ""
  }))

  const orderData = orders.map((o) => ({
    id: o.id,
    status: o.status,
    totalAmount: Number(o.totalAmount),
    deliveryAddress: o.deliveryAddress || "",
    items: Array.isArray(o.items)
      ? o.items.map((i) => ({
          name: i.name || i.food,
          quantity: i.quantity || 1
        }))
      : []
  }))

  return `
You are FoodieHub AI, a friendly food ordering assistant.

Use ONLY the provided FoodieHub database.

RESTAURANTS:
${JSON.stringify(restaurantData)}

MENU:
${JSON.stringify(foodData)}

ORDERS:
${JSON.stringify(orderData)}

RECENT CONVERSATION:
${JSON.stringify(history)}

RULES:
- Remember recent conversation.
- Never invent restaurants or dishes.
- Use exact database names.
- "this", "that", "it", "the first one" refer to recent food recommendations.
- "best" means highest rated matching food.
- Respect budget limits.
- Respect veg and non-veg preferences.
- Keep replies concise and friendly.
- Use ₹ for prices.

When enough information is available to place an order, return ONLY JSON:

{
  "action": "place_order",
  "items": [
    {
      "restaurant": "Exact Restaurant Name",
      "dish": "Exact Dish Name",
      "quantity": 1
    }
  ],
  "deliveryAddress": "Exact delivery address"
}
`
}

// Parse AI order JSON
const tryParseOrderJson = (text = "") => {
  try {
    const clean = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim()

    const match = clean.match(/\{[\s\S]*\}/)

    if (!match) return null

    const parsed = JSON.parse(match[0])

    return parsed?.action === "place_order"
      ? parsed
      : null
  } catch {
    return null
  }
}

// Find restaurant
const findRestaurant = (text, restaurants) => {
  if (!text) return null

  const value = text.trim().toLowerCase()

  return (
    restaurants.find(
      (r) => r.name.toLowerCase() === value
    ) ||
    restaurants.find((r) =>
      value.includes(r.name.toLowerCase())
    )
  )
}

// Find exact food
const findFood = (dish, restaurant, foods) => {
  if (!dish || !restaurant) return null

  const value = dish.trim().toLowerCase()

  return foods.find(
    (f) =>
      f.restaurant?.name?.toLowerCase() ===
        restaurant.name.toLowerCase() &&
      f.name.toLowerCase() === value
  )
}

// Food keyword
const getFoodKeyword = (message) => {
  const text = message.toLowerCase()

  const keywords = [
    "pizza",
    "burger",
    "biryani",
    "momo",
    "pasta",
    "noodles",
    "dosa",
    "thali",
    "tikka",
    "naan",
    "kebab",
    "chicken",
    "mutton",
    "paneer",
    "fries",
    "cake",
    "dessert",
    "sushi",
    "ramen"
  ]

  return keywords.find((keyword) =>
    text.includes(keyword)
  )
}

// Smart food matching
const findFoodMatches = (message, foods) => {
  const text = message.toLowerCase()
  const keyword = getFoodKeyword(message)

  if (!keyword) {
    return foods.filter((food) =>
      text.includes(food.name.toLowerCase())
    )
  }

  return foods.filter((food) => {
    const name = food.name.toLowerCase()

    if (keyword === "pizza") {
      const pizzaNames = [
        "margherita",
        "farmhouse",
        "peppy paneer",
        "veg extravaganza",
        "chicken dominator",
        "pepper barbecue chicken",
        "truffle mushroom pizza"
      ]

      return pizzaNames.some((pizza) =>
        name.includes(pizza)
      )
    }

    if (keyword === "burger") {
      return name.includes("burger")
    }

    if (keyword === "biryani") {
      return name.includes("biryani")
    }

    if (keyword === "momo") {
      return (
        name.includes("momo") ||
        name.includes("dumpling")
      )
    }

    return name.includes(keyword)
  })
}

// Parse multi-item order
const parseMultiItemOrder = (
  message,
  restaurants,
  foods
) => {
  const match = message.trim().match(
    /^order\s+(.+?)\s+from\s+(.+?)\s+to\s+(.+)$/i
  )

  if (!match) return null

  const restaurant = findRestaurant(
    match[2],
    restaurants
  )

  if (!restaurant) {
    return {
      error: `I couldn't find a restaurant named "${match[2]}".`
    }
  }

  const parts = match[1]
    .trim()
    .split(/\s+and\s+/i)

  if (parts.length < 2) return null

  const items = []

  for (const part of parts) {
    const itemMatch = part.match(
      /^(\d+)\s+(.+)$/i
    )

    if (!itemMatch) return null

    const quantity = Number(itemMatch[1])

    const foodItem = findFood(
      itemMatch[2],
      restaurant,
      foods
    )

    if (!foodItem) {
      return {
        error: `"${itemMatch[2]}" is not available at ${restaurant.name}.`,
        alternatives: foods
          .filter(
            (f) =>
              f.restaurant?.name?.toLowerCase() ===
              restaurant.name.toLowerCase()
          )
          .slice(0, 5)
      }
    }

    items.push({
      foodItem,
      quantity
    })
  }

  return {
    restaurant,
    items,
    address: match[3].trim()
  }
}

// Parse single direct order
const parseDirectOrder = (
  message,
  restaurants,
  foods
) => {
  const match = message.trim().match(
    /^order\s+(\d+)\s+(.+?)\s+from\s+(.+?)\s+to\s+(.+)$/i
  )

  if (!match || /\s+and\s+/i.test(match[2])) {
    return null
  }

  const restaurant = findRestaurant(
    match[3],
    restaurants
  )

  if (!restaurant) {
    return {
      error: `I couldn't find a restaurant named "${match[3]}".`
    }
  }

  const foodItem = findFood(
    match[2],
    restaurant,
    foods
  )

  if (!foodItem) {
    return {
      error: `"${match[2]}" is not available at ${restaurant.name}.`,
      alternatives: foods
        .filter(
          (f) =>
            f.restaurant?.name?.toLowerCase() ===
            restaurant.name.toLowerCase()
        )
        .slice(0, 5)
    }
  }

  return {
    restaurant,
    foodItem,
    quantity: Number(match[1]),
    address: match[4].trim()
  }
}

// Get recent food context
const getRecentFoodContext = (
  history,
  foods
) => {
  if (!Array.isArray(history)) return null

  const recent = history
    .slice()
    .reverse()
    .filter(
      (item) =>
        item?.role &&
        item?.content
    )

  for (const message of recent) {
    const content =
      String(message.content).toLowerCase()

    const matches = foods.filter(
      (food) =>
        content.includes(
          food.name.toLowerCase()
        )
    )

    if (matches.length) {
      return matches[0]
    }
  }

  return null
}

// Detect contextual order
const parseContextualOrder = (
  message,
  history,
  restaurants,
  foods
) => {
  const text =
    message.toLowerCase().trim()

  const orderWords = [
    "order this",
    "order that",
    "order it",
    "buy this",
    "buy that",
    "take this",
    "take that",
    "i'll take this",
    "i will take this",
    "yes order it",
    "yes, order it",
    "order the first one"
  ]

  const isContextOrder =
    orderWords.some(
      (word) =>
        text === word ||
        text.includes(word)
    )

  if (!isContextOrder) return null

  const foodItem =
    getRecentFoodContext(
      history,
      foods
    )

  if (!foodItem) {
    return {
      error:
        "Sure! Which food would you like me to order? 😋"
    }
  }

  const restaurant =
    restaurants.find(
      (r) =>
        r.name.toLowerCase() ===
        foodItem.restaurant?.name?.toLowerCase()
    )

  if (!restaurant) {
    return {
      error:
        "I found the food, but couldn't identify its restaurant."
    }
  }

  const quantityMatch =
    text.match(/\b(\d+)\b/)

  return {
    restaurant,
    foodItem,
    quantity: quantityMatch
      ? Number(quantityMatch[1])
      : 1
  }
}

// Detect pending address
const parsePendingAddress = (
  message,
  history,
  restaurants,
  foods
) => {
  const text = message.trim()

  if (!Array.isArray(history)) {
    return null
  }

  const recent =
    history.slice().reverse()

  const askedForAddress =
    recent.some(
      (item) =>
        item?.role === "assistant" &&
        /delivery address|address should i use|what.*address|deliver/i.test(
          String(item.content || "")
        )
    )

  if (!askedForAddress) {
    return null
  }

  if (text.length < 5) {
    return null
  }

  const foodItem =
    getRecentFoodContext(
      history,
      foods
    )

  if (!foodItem) {
    return null
  }

  const restaurant =
    restaurants.find(
      (r) =>
        r.name.toLowerCase() ===
        foodItem.restaurant?.name?.toLowerCase()
    )

  if (!restaurant) {
    return null
  }

  const quantityMatch =
    text.match(
      /(?:quantity|qty|number|pieces?)?\s*(\d+)\s*$/i
    )

  return {
    foodItem,
    restaurant,
    quantity: quantityMatch
      ? Number(quantityMatch[1])
      : 1,
    address: text
  }
}

// Food discovery
const foodDiscovery = (
  message,
  foods
) => {
  const text =
    message.toLowerCase()

  const isBest =
    text.includes("best") ||
    text.includes("top") ||
    text.includes("which") ||
    text.includes("recommend") ||
    text.includes("est")

  const isVeg =
    /\bveg\b/.test(text) &&
    !text.includes("non-veg") &&
    !text.includes("non veg")

  const isNonVeg =
    text.includes("non-veg") ||
    text.includes("non veg") ||
    text.includes("nonveg")

  const budgetMatch =
    text.match(
      /(?:under|below|within|less than)\s*₹?\s*(\d+)/i
    )

  let matches =
    findFoodMatches(
      message,
      foods
    )

  if (isVeg) {
    matches =
      matches.filter(
        (food) =>
          food.category?.toLowerCase() ===
          "veg"
      )
  }

  if (isNonVeg) {
    matches =
      matches.filter(
        (food) =>
          food.category?.toLowerCase() ===
          "non-veg"
      )
  }

  if (budgetMatch) {
    const budget =
      Number(budgetMatch[1])

    matches =
      matches.filter(
        (food) =>
          Number(food.price) <=
          budget
      )
  }

  matches =
    matches.filter(
      (food) =>
        food.isAvailable !== false
    )

  matches.sort(
    (a, b) =>
      Number(b.rating || 0) -
      Number(a.rating || 0)
  )

  return matches.slice(
    0,
    isBest ? 5 : 8
  )
}

// Fallback assistant
const fallbackAssistant = (
  message,
  restaurants,
  foods,
  orders,
  history = []
) => {
  const text =
    message.toLowerCase().trim()

  if (
    [
      "hi",
      "hello",
      "hey",
      "hii",
      "helo"
    ].includes(text)
  ) {
    return `Hey! 👋 Welcome to FoodieHub.

I can help you discover food, restaurants, recommendations and orders. 😋

What are you craving today?`
  }

  if (
    text.includes("track") ||
    text.includes("latest order") ||
    text.includes("my order") ||
    text.includes("order status")
  ) {
    if (!orders.length) {
      return "You don't have any orders yet. 🍽️"
    }

    const order =
      orders[0]

    return `📦 Your latest order is currently **${order.status}**.

💰 Total: ₹${Number(
      order.totalAmount
    )}

You can track it from your FoodieHub Dashboard.`
  }

  if (
    (text.includes("show") &&
      text.includes("restaurant")) ||
    (text.includes("list") &&
      text.includes("restaurant"))
  ) {
    return `🍽️ Here are some FoodieHub restaurants:

${restaurants
  .slice(0, 8)
  .map(
    (r) =>
      `• ${r.name} — ${
        r.category
      } ⭐ ${Number(r.rating)}`
  )
  .join("\n")}

Want to explore a restaurant? 😋`
  }

  const contextualOrder =
    parseContextualOrder(
      message,
      history,
      restaurants,
      foods
    )

  if (contextualOrder) {
    if (contextualOrder.error) {
      return `❌ ${contextualOrder.error}`
    }

    const {
      foodItem,
      restaurant,
      quantity
    } = contextualOrder

    return `🍕 Great choice!

${foodItem.name} — ₹${Number(
      foodItem.price
    )} at ${restaurant.name}

🔢 Quantity: ${quantity}

📍 What's your delivery address?`
  }

  const restaurant =
    restaurants.find((r) =>
      text.includes(
        r.name.toLowerCase()
      )
    )

  if (restaurant) {
    const menu =
      foods
        .filter(
          (f) =>
            f.restaurant?.name?.toLowerCase() ===
            restaurant.name.toLowerCase()
        )
        .sort(
          (a, b) =>
            Number(b.rating || 0) -
            Number(a.rating || 0)
        )
        .slice(0, 8)

    return `🍽️ ${restaurant.name}

${restaurant.category} ⭐ ${Number(
      restaurant.rating
    )}

Popular dishes:

${menu
  .map(
    (f) =>
      `• ${f.name} — ₹${Number(
        f.price
      )} ⭐ ${Number(
        f.rating || 4.5
      )}`
  )
  .join("\n")}

Which one would you like to try? 😋`
  }

  const discovered =
    foodDiscovery(
      message,
      foods
    )

  if (discovered.length) {
    const budgetMatch =
      text.match(
        /(?:under|below|within|less than)\s*₹?\s*(\d+)/i
      )

    const isVeg =
      /\bveg\b/.test(text) &&
      !text.includes("non-veg") &&
      !text.includes("non veg")

    const isNonVeg =
      text.includes("non-veg") ||
      text.includes("non veg") ||
      text.includes("nonveg")

    const isBest =
      text.includes("best") ||
      text.includes("top") ||
      text.includes("which") ||
      text.includes("est")

    let title =
      "🍽️ Great choice!"

    if (budgetMatch) {
      title =
        `💰 Options under ₹${budgetMatch[1]}:`
    } else if (isVeg) {
      title =
        "🌱 Here are the veg options:"
    } else if (isNonVeg) {
      title =
        "🍗 Here are the non-veg options:"
    } else if (isBest) {
      title =
        "⭐ Here are the best matching options:"
    }

    return `${title}

${discovered
  .map(
    (food, index) =>
      `${isBest ? `${index + 1}.` : "•"} ${
        food.name
      } — ₹${Number(
        food.price
      )} at ${
        food.restaurant?.name ||
        "FoodieHub"
      } ⭐ ${Number(
        food.rating || 4.5
      )}`
  )
  .join("\n")}

Want me to help you choose one? 😋`
  }

  if (
    text.includes("recommend") ||
    text.includes("suggest") ||
    text.includes("hungry") ||
    text.includes("what should")
  ) {
    const recommendations =
      [...foods]
        .sort(
          (a, b) =>
            Number(b.rating || 0) -
            Number(a.rating || 0)
        )
        .slice(0, 5)

    return `😋 I've got you!

Top FoodieHub picks:

${recommendations
  .map(
    (food) =>
      `• ${food.name} — ₹${Number(
        food.price
      )} at ${
        food.restaurant?.name ||
        "FoodieHub"
      } ⭐ ${Number(
        food.rating || 4.5
      )}`
  )
  .join("\n")}

Tell me your budget or food preference and I'll narrow it down.`
  }

  return `I'm here to help! 😋

Try asking:

🍕 "Show me pizza"

⭐ "Which pizza is best?"

💰 "Pizza under ₹300"

🌱 "Show me veg pizza"

🍗 "Show me non-veg food"

🍽️ "What can I order from SRV?"

🔎 "Where can I find Chicken Biryani?"

📦 "Track my latest order"`
}

// Create validated order
const createValidatedOrder = async (
  userId,
  items,
  address
) => {
  const orderItems =
    items.map(
      ({
        foodItem,
        quantity,
        restaurant
      }) => ({
        food: foodItem.name,
        name: foodItem.name,
        category: foodItem.category,
        price: Number(foodItem.price),
        quantity: Number(quantity),
        image: foodItem.image,
        restaurantId: restaurant.id
      })
    )

  const totalAmount =
    orderItems.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          Number(item.quantity),
      0
    )

  const createdOrder =
    await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      deliveryAddress: {
        address,
        city: address
      },
      status: "placed"
    })

  return {
    createdOrder,
    orderItems,
    totalAmount
  }
}

// Main controller
const handleChat = async (
  req,
  res
) => {
  try {
    const {
      message,
      history = []
    } = req.body

    if (!message?.trim()) {
      return res.status(400).json({
        reply:
          "Tell me what you're looking for. 😋"
      })
    }

    const restaurants =
      await Restaurant.findAll({
        order: [["name", "ASC"]]
      })

    const foods =
      await Food.findAll({
        include: [
          {
            model: Restaurant,
            as: "restaurant",
            attributes: [
              "name",
              "category"
            ]
          }
        ]
      })

    const orders =
      await Order.findAll({
        where: {
          userId: req.user.id
        },
        order: [
          ["createdAt", "DESC"]
        ],
        limit: 5
      })

    // Multi-item order
    const multiOrder =
      parseMultiItemOrder(
        message,
        restaurants,
        foods
      )

    if (multiOrder) {
      if (multiOrder.error) {
        let reply =
          `❌ ${multiOrder.error}`

        if (
          multiOrder.alternatives?.length
        ) {
          reply +=
            `\n\nTry these:\n\n${multiOrder.alternatives
              .map(
                (food) =>
                  `• ${food.name} — ₹${Number(
                    food.price
                  )}`
              )
              .join("\n")}`
        }

        return res.status(200).json({
          reply
        })
      }

      const result =
        await createValidatedOrder(
          req.user.id,
          multiOrder.items.map(
            (item) => ({
              foodItem:
                item.foodItem,
              quantity:
                item.quantity,
              restaurant:
                multiOrder.restaurant
            })
          ),
          multiOrder.address
        )

      return res.status(200).json({
        reply: `🎉 Order placed successfully!

🏪 ${multiOrder.restaurant.name}

${result.orderItems
  .map(
    (item) =>
      `• ${item.quantity} × ${
        item.name
      } — ₹${
        Number(item.price) *
        Number(item.quantity)
      }`
  )
  .join("\n")}

💰 Total: ₹${
          result.totalAmount
        }
📍 Delivery: ${
          multiOrder.address
        }

📦 Order ID: ${
          result.createdOrder.id
        }

Your complete order has been placed! 🚀`
      })
    }

    // Single direct order
    const directOrder =
      parseDirectOrder(
        message,
        restaurants,
        foods
      )

    if (directOrder) {
      if (directOrder.error) {
        let reply =
          `❌ ${directOrder.error}`

        if (
          directOrder.alternatives?.length
        ) {
          reply +=
            `\n\nTry these:\n\n${directOrder.alternatives
              .map(
                (food) =>
                  `• ${food.name} — ₹${Number(
                    food.price
                  )}`
              )
              .join("\n")}`
        }

        return res.status(200).json({
          reply
        })
      }

      const result =
        await createValidatedOrder(
          req.user.id,
          [
            {
              foodItem:
                directOrder.foodItem,
              quantity:
                directOrder.quantity,
              restaurant:
                directOrder.restaurant
            }
          ],
          directOrder.address
        )

      return res.status(200).json({
        reply: `🎉 Order placed successfully!

🍽️ ${
          directOrder.foodItem.name
        }
🏪 ${
          directOrder.restaurant.name
        }
🔢 Quantity: ${
          directOrder.quantity
        }
💰 Total: ₹${
          result.totalAmount
        }
📍 Delivery: ${
          directOrder.address
        }

📦 Order ID: ${
          result.createdOrder.id
        }

Your order is now being prepared! 🚀`
      })
    }

    // Pending address
    const pendingAddress =
      parsePendingAddress(
        message,
        history,
        restaurants,
        foods
      )

    if (pendingAddress) {
      const result =
        await createValidatedOrder(
          req.user.id,
          [
            {
              foodItem:
                pendingAddress.foodItem,
              quantity:
                pendingAddress.quantity,
              restaurant:
                pendingAddress.restaurant
            }
          ],
          pendingAddress.address
        )

      return res.status(200).json({
        reply: `🎉 Order placed successfully!

🍕 ${
          pendingAddress.foodItem.name
        }
🏪 ${
          pendingAddress.restaurant.name
        }
🔢 Quantity: ${
          pendingAddress.quantity
        }
💰 Total: ₹${
          result.totalAmount
        }
📍 Delivery: ${
          pendingAddress.address
        }

📦 Order ID: ${
          result.createdOrder.id
        }

Your order has been placed successfully! 🚀`
      })
    }

    // Contextual order
    const contextualOrder =
      parseContextualOrder(
        message,
        history,
        restaurants,
        foods
      )

    if (contextualOrder) {
      if (contextualOrder.error) {
        return res.status(200).json({
          reply:
            `❌ ${contextualOrder.error}`
        })
      }

      const {
        foodItem,
        restaurant,
        quantity
      } = contextualOrder

      const text =
        message.toLowerCase()

      const addressMatch =
        text.match(
          /(?:to|at|deliver to)\s+(.+)/i
        )

      if (addressMatch) {
        const result =
          await createValidatedOrder(
            req.user.id,
            [
              {
                foodItem,
                quantity,
                restaurant
              }
            ],
            addressMatch[1].trim()
          )

        return res.status(200).json({
          reply: `🎉 Order placed successfully!

🍕 ${foodItem.name}
🏪 ${restaurant.name}
🔢 Quantity: ${quantity}
💰 Total: ₹${
            result.totalAmount
          }
📍 Delivery: ${
            addressMatch[1].trim()
          }

📦 Order ID: ${
            result.createdOrder.id
          }

Your order has been placed successfully! 🚀`
        })
      }

      return res.status(200).json({
        reply: `🍕 Great choice!

${foodItem.name} — ₹${Number(
          foodItem.price
        )} at ${restaurant.name}

🔢 Quantity: ${quantity}

📍 What's your delivery address?`
      })
    }

    // Mistral AI
    const apiKey =
      process.env.MISTRAL_API_KEY

    if (!apiKey) {
      return res.status(200).json({
        reply:
          fallbackAssistant(
            message,
            restaurants,
            foods,
            orders,
            history
          )
      })
    }

    const recentHistory =
      Array.isArray(history)
        ? history.slice(-10)
        : []

    const systemPrompt =
      buildSystemPrompt(
        restaurants,
        foods,
        orders,
        recentHistory
      )

    try {
      const response =
        await axios.post(
          "https://api.mistral.ai/v1/chat/completions",
          {
            model:
              process.env.MISTRAL_MODEL ||
              "mistral-small-latest",

            messages: [
              {
                role: "system",
                content:
                  systemPrompt
              },
              ...recentHistory
                .filter(
                  (item) =>
                    item?.role &&
                    item?.content
                )
                .map(
                  (item) => ({
                    role:
                      item.role ===
                      "assistant"
                        ? "assistant"
                        : "user",
                    content:
                      String(
                        item.content
                      )
                  })
                ),
              {
                role: "user",
                content: message
              }
            ],

            max_tokens: 500,
            temperature: 0.2,
            top_p: 0.9
          },
          {
            headers: {
              Authorization:
                `Bearer ${apiKey}`,
              "Content-Type":
                "application/json"
            },
            timeout: 30000
          }
        )

      const replyText =
        response.data
          .choices?.[0]
          ?.message?.content
          ?.trim()

      if (!replyText) {
        return res.status(200).json({
          reply:
            fallbackAssistant(
              message,
              restaurants,
              foods,
              orders,
              history
            )
        })
      }

      const orderRequest =
        tryParseOrderJson(
          replyText
        )

      if (orderRequest) {
        const requestedItems =
          Array.isArray(
            orderRequest.items
          )
            ? orderRequest.items
            : []

        if (!requestedItems.length) {
          return res.status(200).json({
            reply:
              "I need at least one food item to place the order. 😋"
          })
        }

        const validatedItems = []

        for (
          const requestedItem
          of requestedItems
        ) {
          const restaurant =
            findRestaurant(
              requestedItem.restaurant,
              restaurants
            )

          if (!restaurant) {
            return res.status(200).json({
              reply:
                `I couldn't find "${requestedItem.restaurant}" in FoodieHub.`
            })
          }

          const foodItem =
            findFood(
              requestedItem.dish,
              restaurant,
              foods
            )

          if (!foodItem) {
            return res.status(200).json({
              reply:
                `"${requestedItem.dish}" isn't available at ${restaurant.name}.`
            })
          }

          const quantity =
            Number(
              requestedItem.quantity
            )

          if (
            !Number.isFinite(
              quantity
            ) ||
            quantity < 1
          ) {
            return res.status(200).json({
              reply:
                "Please provide a valid quantity. 😋"
            })
          }

          validatedItems.push({
            foodItem,
            quantity,
            restaurant
          })
        }

        const address =
          typeof orderRequest.deliveryAddress ===
          "string"
            ? orderRequest.deliveryAddress.trim()
            : ""

        if (!address) {
          return res.status(200).json({
            reply:
              "Great choice! 📍 What delivery address should I use?"
          })
        }

        const result =
          await createValidatedOrder(
            req.user.id,
            validatedItems,
            address
          )

        return res.status(200).json({
          reply: `🎉 Order placed successfully!

${result.orderItems
  .map(
    (item) =>
      `• ${item.quantity} × ${
        item.name
      } — ₹${
        Number(item.price) *
        Number(item.quantity)
      }`
  )
  .join("\n")}

💰 Total: ₹${
          result.totalAmount
        }
📍 Delivery: ${address}

📦 Order ID: ${
          result.createdOrder.id
        }

Your order has been placed successfully! 🚀`
        })
      }

      return res.status(200).json({
        reply: replyText
      })
    } catch (aiError) {
      console.error(
        "Mistral API Error:",
        aiError?.response?.data ||
          aiError.message
      )

      return res.status(200).json({
        reply:
          fallbackAssistant(
            message,
            restaurants,
            foods,
            orders,
            history
          )
      })
    }
  } catch (error) {
    console.error(
      "Chatbot Error:",
      error?.response?.data ||
        error.message
    )

    return res.status(500).json({
      reply:
        "Sorry, something went wrong while processing your request."
    })
  }
}

module.exports = {
  handleChat
}