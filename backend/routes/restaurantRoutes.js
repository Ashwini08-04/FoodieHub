const express = require("express");

const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

const { isAuth, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

// Protected Routes
router.post("/", isAuth, isAdmin, createRestaurant);
router.put("/:id", isAuth, isAdmin, updateRestaurant);
router.delete("/:id", isAuth, isAdmin, deleteRestaurant);

module.exports = router;
