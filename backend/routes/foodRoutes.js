const express = require("express");

const {
  getFoods,
  getFoodById,
  getFoodsByRestaurant,
  createFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

const { isAuth, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.get("/", getFoods);
router.get("/restaurant/:restaurantId", getFoodsByRestaurant);
router.get("/:id", getFoodById);

// Protected Routes
router.post("/", isAuth, createFood);
router.put("/:id", isAuth, updateFood);
router.delete("/:id", isAuth, deleteFood);

module.exports = router;