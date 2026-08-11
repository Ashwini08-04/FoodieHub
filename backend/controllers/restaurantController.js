const { Restaurant } = require("../models");

// Get all restaurants
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      order: [["createdAt", "DESC"]]
    });
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurants", error: error.message });
  }
};

// Get single restaurant
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurant", error: error.message });
  }
};

// Create restaurant
const createRestaurant = async (req, res) => {
  try {
    const { name, category, image, rating, deliveryTime, distance, offer, address } = req.body;
    
    const existingRestaurant = await Restaurant.findOne({ where: { name } });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    const restaurant = await Restaurant.create({
      name, category, image, rating, deliveryTime, distance, offer, address, ownerId: req.user.id
    });
    
    res.status(201).json({ message: "Restaurant created successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Failed to create restaurant", error: error.message });
  }
};

// Update restaurant
const updateRestaurant = async (req, res) => {
  try {
    const [updatedRows] = await Restaurant.update(req.body, {
      where: { id: req.params.id }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const restaurant = await Restaurant.findByPk(req.params.id);
    res.status(200).json({ message: "Restaurant updated successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Failed to update restaurant", error: error.message });
  }
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const deleted = await Restaurant.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete restaurant", error: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};