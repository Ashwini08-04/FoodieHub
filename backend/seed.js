require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = require("./config/db");

const Restaurant = require("./models/Restaurant");
const Food = require("./models/Food");

const seedData = async () => {
  try {
    await connectDB();

    // Clear old data
    await Restaurant.deleteMany();
    await Food.deleteMany();

    console.log("Old data deleted.");

    // Create Restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: "Pizza House",
        category: "Italian Food",
        image: "/images/pizza-house.jpg",
        rating: 4.6,
        deliveryTime: "25-30 min",
        distance: "1.8 km",
        offer: "20% OFF"
      },
      {
        name: "Burger Point",
        category: "Fast Food",
        image: "/images/burger-point.jpg",
        rating: 4.4,
        deliveryTime: "20-25 min",
        distance: "2.3 km",
        offer: "15% OFF"
      },
      {
        name: "Food Corner",
        category: "Indian Food",
        image: "/images/food-corner.jpg",
        rating: 4.7,
        deliveryTime: "30-35 min",
        distance: "1.5 km",
        offer: "25% OFF"
      }
    ]);

    // Create Foods
    await Food.insertMany([
      {
        name: "Cheese Pizza",
        category: "Italian",
        description: "Loaded with mozzarella cheese",
        price: 299,
        image: "/images/cheese-pizza.jpg",
        rating: 4.8,
        restaurant: restaurants[0]._id
      },
      {
        name: "Veg Pizza",
        category: "Italian",
        description: "Fresh vegetable pizza",
        price: 249,
        image: "/images/veg-pizza.jpg",
        rating: 4.5,
        restaurant: restaurants[0]._id
      },
      {
        name: "Veg Burger",
        category: "Fast Food",
        description: "Crispy veg burger",
        price: 199,
        image: "/images/veg-burger.jpg",
        rating: 4.4,
        restaurant: restaurants[1]._id
      },
      {
        name: "French Fries",
        category: "Snacks",
        description: "Golden crispy fries",
        price: 129,
        image: "/images/fries.jpg",
        rating: 4.3,
        restaurant: restaurants[1]._id
      },
      {
        name: "Paneer Tikka",
        category: "Indian",
        description: "Spicy paneer tikka",
        price: 249,
        image: "/images/paneer-tikka.jpg",
        rating: 4.7,
        restaurant: restaurants[2]._id
      },
      {
        name: "Veg Thali",
        category: "Indian",
        description: "Traditional veg thali",
        price: 199,
        image: "/images/veg-thali.jpg",
        rating: 4.6,
        restaurant: restaurants[2]._id
      }
    ]);

    console.log("Database seeded successfully!");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedData();