const express = require("express");

const {
  getRestaurants,
  getRestaurantById,
  getOwnerRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

const { isAuth, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.get("/", getRestaurants);
router.get("/owner", isAuth, getOwnerRestaurants);
router.get("/:id", getRestaurantById);

// Protected Routes
router.post("/", isAuth, createRestaurant);
router.put("/:id", isAuth, updateRestaurant);
router.delete("/:id", isAuth, deleteRestaurant);

module.exports = router;
