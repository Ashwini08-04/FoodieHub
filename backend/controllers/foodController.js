const Food = require("../models/Food");

// Get all food items
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("restaurant")
      .sort({ createdAt: -1 });

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch food items",
      error: error.message,
    });
  }
};

// Get single food item
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("restaurant");

    if (!food) {
      return res.status(404).json({
        message: "Food item not found",
      });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch food item",
      error: error.message,
    });
  }
};

// Get food by restaurant
const getFoodsByRestaurant = async (req, res) => {
  try {
    const foods = await Food.find({
      restaurant: req.params.restaurantId,
    }).sort({ createdAt: -1 });

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch restaurant food",
      error: error.message,
    });
  }
};

// Create food
const createFood = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      image,
      rating,
      isAvailable,
      restaurant,
    } = req.body;

    if (!name || !category || !price || !image || !restaurant) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const existingFood = await Food.findOne({
      name,
      restaurant,
    });

    if (existingFood) {
      return res.status(400).json({
        message: "Food item already exists",
      });
    }

    const food = await Food.create({
      name,
      category,
      description,
      price,
      image,
      rating,
      isAvailable,
      restaurant,
    });

    res.status(201).json({
      message: "Food item created successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create food item",
      error: error.message,
    });
  }
};

// Update food
const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!food) {
      return res.status(404).json({
        message: "Food item not found",
      });
    }

    res.status(200).json({
      message: "Food item updated successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update food item",
      error: error.message,
    });
  }
};

// Delete food
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food item not found",
      });
    }

    res.status(200).json({
      message: "Food item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete food item",
      error: error.message,
    });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  getFoodsByRestaurant,
  createFood,
  updateFood,
  deleteFood,
};