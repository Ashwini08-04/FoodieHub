const mongoose = require("mongoose")
const Restaurant = require("../models/Restaurant")

// Get all restaurants
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });

    res.status(200).json(restaurants)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch restaurants",
      error: error.message
    })
  }
}

// Get single restaurant
const getRestaurantById = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid restaurant ID"
      })
    }

    const restaurant = await Restaurant.findById(
      req.params.id
    )

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      })
    }

    res.status(200).json(restaurant)

  } catch (error) {

    console.error(
      "Get restaurant error:",
      error
    )

    res.status(500).json({
      message: "Failed to fetch restaurant",
      error: error.message
    })
  }
}
// Create restaurant
const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      category,
      image,
      rating,
      deliveryTime,
      distance,
      offer
    } = req.body
     const existingRestaurant = await Restaurant.findOne({ name });

if (existingRestaurant) {
  return res.status(400).json({
    message: "Restaurant already exists",
  });
}

const restaurant = await Restaurant.create({
  name,
  category,
  image,
  rating,
  deliveryTime,
  distance,
  offer,
});
    
    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create restaurant",
      error: error.message
    })
  }
}

// Update restaurant
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      })
    }

    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update restaurant",
      error: error.message
    })
  }
}

// Delete restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(
      req.params.id
    )

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      })
    }

    res.status(200).json({
      message: "Restaurant deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete restaurant",
      error: error.message
    })
  }
}

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
}