const { Food, Restaurant } = require("../models");

// Get all foods (public)
const getFoods = async (req, res) => {
  try {
    const foods = await Food.findAll({
      include: [{ model: Restaurant, as: "restaurant", attributes: ["name"] }]
    });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch foods", error: error.message });
  }
};

// Get single food by id
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findByPk(req.params.id, {
      include: [{ model: Restaurant, as: "restaurant", attributes: ["name"] }]
    });
    if (!food) return res.status(404).json({ message: "Food item not found" });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch food", error: error.message });
  }
};

// Get foods by restaurant
const getFoodsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    // Optional filter
    const filter = { restaurantId };
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const foods = await Food.findAll({
      where: filter,
      include: [{
        model: Restaurant,
        as: "restaurant",
        attributes: ["name"]
      }]
    });

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items", error: error.message });
  }
};

// Create food item
const createFood = async (req, res) => {
  try {
    const { name, price, image, category, description, isAvailable } = req.body;
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const food = await Food.create({
      name, price, image, category, description, isAvailable, restaurantId
    });

    res.status(201).json({ message: "Food item created successfully", food });
  } catch (error) {
    res.status(500).json({ message: "Failed to create food item", error: error.message });
  }
};

// Update food item
const updateFood = async (req, res) => {
  try {
    const [updatedRows] = await Food.update(req.body, {
      where: { id: req.params.id }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Food item not found" });
    }
    
    const food = await Food.findByPk(req.params.id);
    res.status(200).json({ message: "Food item updated successfully", food });
  } catch (error) {
    res.status(500).json({ message: "Failed to update food item", error: error.message });
  }
};

// Delete food item
const deleteFood = async (req, res) => {
  try {
    const deleted = await Food.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food item", error: error.message });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  getFoodsByRestaurant,
  createFood,
  updateFood,
  deleteFood
};