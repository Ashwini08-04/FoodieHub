const bcrypt = require("bcrypt");
const { sequelize, User, Restaurant, Food } = require("./models");
require("dotenv").config();

const cuisines = ["North Indian", "South Indian", "Chinese", "Italian", "Fast Food", "Desserts", "Beverages", "Healthy", "Street Food", "Bakery"];
const restaurantNames = [
  "Saffron Spoon",
  "Bella Pizza House",
  "Burger Barn",
  "Thali Corner",
  "Green Bowl",
  "Flame Grill",
  "Ocean Catch",
  "Sugar Rush",
  "Urban Eats",
  "Spice Route",
];
const restaurantImages = [
  "/images/indian.jpg",
  "/images/pizza-house.jpg",
  "/images/burger-point.jpg",
  "/images/food-corner.jpg",
  "/images/veg-burger.jpg",
  "/images/classic-burger.jpg",
  "/images/cheese-pizza.jpg",
  "/images/veg-thali.jpg",
  "/images/pizza.jpg",
  "/images/masala-dosa.jpg",
];

const restaurantsData = restaurantNames.map((name, i) => ({
  name,
  category: cuisines[i % cuisines.length],
  image: restaurantImages[i],
  rating: (Math.random() * 2 + 3).toFixed(1),
  deliveryTime: `${Math.floor(Math.random() * 30) + 15} min`,
  distance: `${(Math.random() * 5 + 1).toFixed(1)} km`,
  offer: `${Math.floor(Math.random() * 40) + 10}% OFF`,
  address: `Street ${i + 1}, Food City`,
  isOpen: true,
}));

const foodDataTemplate = [
  { name: "Paneer Butter Masala", category: "veg", price: 250, image: "/images/paneer-masala.jpg" },
  { name: "Chicken Tikka", category: "non-veg", price: 300, image: "/images/chicken-burger.jpg" },
  { name: "Margherita Pizza", category: "veg", price: 350, image: "/images/cheese-pizza.jpg" },
  { name: "Pasta Alfredo", category: "veg", price: 280, image: "/images/pizza.jpg" },
  { name: "Mutton Biryani", category: "non-veg", price: 400, image: "/images/biryani.jpg" },
  { name: "Veg Hakka Noodles", category: "veg", price: 180, image: "/images/masala-dosa.jpg" },
  { name: "Chilli Chicken", category: "non-veg", price: 260, image: "/images/chicken-burger.jpg" },
  { name: "Masala Dosa", category: "veg", price: 120, image: "/images/masala-dosa.jpg" },
  { name: "Chocolate Brownie", category: "veg", price: 150, image: "/images/pizza-house.jpg" },
  { name: "Cold Coffee", category: "veg", price: 100, image: "/images/fries.jpg" }
];

async function seedDatabase() {
  try {
    console.log("Connecting to SQLite and syncing models (force: true)...");
    await sequelize.sync({ force: true });

    console.log("Creating users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@foodiehub.com",
      password: hashedPassword,
      role: "admin"
    });

    const user = await User.create({
      name: "Test User",
      email: "user@foodiehub.com",
      password: hashedPassword,
      role: "user"
    });
    
    console.log("Creating exactly 10 restaurants and exactly 100 food items...");
    for (let i = 0; i < restaurantsData.length; i++) {
      const restData = { ...restaurantsData[i], ownerId: admin.id };
      const restaurant = await Restaurant.create(restData);

      const foodsToCreate = foodDataTemplate.map(f => ({
        ...f,
        description: `Delicious ${f.name} prepared with fresh ingredients.`,
        image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        isAvailable: true,
        restaurantId: restaurant.id
      }));

      await Food.bulkCreate(foodsToCreate);
    }

    console.log("SQLite Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding SQLite database:", error);
    process.exit(1);
  }
}

seedDatabase();