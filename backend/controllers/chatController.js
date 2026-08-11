const axios = require("axios");
const { Restaurant, Food, Order } = require("../models");

const buildSystemPrompt = (user, restaurants, foods, orders) => {
  const restaurantSummaries = restaurants.map((restaurant) => ({
    name: restaurant.name,
    category: restaurant.category,
    rating: restaurant.rating,
    offer: restaurant.offer,
    address: restaurant.address || "",
  }));

  const foodSummaries = foods.map((food) => ({
    restaurant: food.restaurant?.name || "",
    name: food.name,
    category: food.category,
    price: Number(food.price),
    description: food.description || "",
  }));

  const orderSummaries = orders.map((order) => ({
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    deliveryAddress: order.deliveryAddress || "",
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({ name: item.name || item.food, quantity: item.quantity || 1 }))
      : [],
  }));

  return `You are a helpful and friendly food ordering assistant for FoodieHub.
Use the restaurant, menu, and order history data below to answer questions about where to eat, what to order, how much items cost, and how to place an order.

Keep answers warm, direct, and concise.

Restaurants:
${JSON.stringify(restaurantSummaries, null, 2)}

Menu items:
${JSON.stringify(foodSummaries, null, 2)}

User order history:
${JSON.stringify(orderSummaries, null, 2)}

Guidelines:
- Always use the exact restaurant and dish names from the data above.
- If the user asks for recommendations, mention restaurant names and menu items that exist in the current data.
- If the user asks to place an order and includes restaurant, dish, quantity, and delivery address, respond only with JSON in this format:
{"action":"place_order","restaurant":"Restaurant Name","dish":"Dish Name","quantity":1,"deliveryAddress":"123 Main St"}
- Do not include any additional text outside of the JSON when placing an order.
- If the user asks about a menu or prices, answer conversationally using the menu data.
- If the user asks to track orders, mention the current order status from the order history.
- If any order detail is missing or unclear, ask a follow-up question for restaurant name, dish, quantity, or delivery address.
- Use currency numbers exactly as listed in menu prices.
`;
};

const tryParseOrderJson = (text) => {
  const jsonMatch = text.match(/\{[^]*\}/);
  if (!jsonMatch) return null;

  try {
    const candidate = JSON.parse(jsonMatch[0]);
    if (candidate?.action === "place_order") {
      return candidate;
    }
  } catch {
    return null;
  }

  return null;
};

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "Please provide a message." });
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ reply: "Mistral API key not configured on server." });
    }

    const restaurants = await Restaurant.findAll({ order: [["name", "ASC"]] });
    const foods = await Food.findAll({ include: [{ model: Restaurant, as: "restaurant", attributes: ["name"] }] });
    const orders = await Order.findAll({ where: { userId: req.user.id }, order: [["createdAt", "DESC"]], limit: 5 });

    const systemPrompt = buildSystemPrompt(req.user, restaurants, foods, orders);

    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-tiny",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 250,
        temperature: 0.2,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const replyText = response.data.choices?.[0]?.message?.content?.trim() || "I could not understand that. Can you try again?";
    const orderRequest = tryParseOrderJson(replyText);

    if (orderRequest) {
      const restaurant = restaurants.find((rest) => rest.name.toLowerCase() === orderRequest.restaurant.toLowerCase());
      const foodItem = foods.find((food) => food.name.toLowerCase() === orderRequest.dish.toLowerCase() && food.restaurant?.name.toLowerCase() === restaurant?.name.toLowerCase());

      if (!restaurant || !foodItem) {
        return res.status(200).json({ reply: "I found your order request, but I couldn't match the restaurant or dish. Please check the name and try again." });
      }

      if (!orderRequest.deliveryAddress) {
        return res.status(200).json({ reply: "I can place this order for you. Please tell me the delivery address in this format: Order [quantity] [dish] from [restaurant] to [address]." });
      }

      const quantity = Number(orderRequest.quantity) || 1;
      const totalAmount = Number(foodItem.price || 0) * quantity;

      const createdOrder = await Order.create({
        userId: req.user.id,
        items: [{ food: foodItem.name, name: foodItem.name, price: Number(foodItem.price || 0), quantity, restaurantId: restaurant.id }],
        totalAmount,
        deliveryAddress: orderRequest.deliveryAddress,
        status: "placed",
      });

      return res.status(200).json({ reply: `✅ Your order for ${quantity} ${foodItem.name} from ${restaurant.name} has been placed. Order ID: ${createdOrder.id}` });
    }

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    console.error("Chatbot Error:", error?.response?.data || error.message);
    res.status(500).json({ reply: "Sorry, I am having trouble connecting to my brain right now." });
  }
};

module.exports = { handleChat };
