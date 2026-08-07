const express = require("express");

const {
  getFoods,
  getFoodById,
  getFoodsByRestaurant,
  createFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.get("/", getFoods);

router.get("/restaurant/:restaurantId", getFoodsByRestaurant);

router.get("/:id", getFoodById);

// Protected Routes
router.post("/", authMiddleware, createFood);

router.put("/:id", authMiddleware, updateFood);

router.delete("/:id", authMiddleware, deleteFood);

module.exports = router;