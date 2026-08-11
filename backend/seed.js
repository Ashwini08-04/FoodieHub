const bcrypt = require("bcrypt");
const { sequelize, User, Restaurant, Food } = require("./models");
require("dotenv").config();

const cuisines = ["North Indian", "South Indian", "Chinese", "Italian", "Fast Food", "Desserts", "Beverages", "Healthy", "Street Food", "Bakery"];

const restaurantsData = Array.from({ length: 10 }).map((_, i) => ({
  name: `Restaurant ${i + 1}`,
  category: cuisines[i % cuisines.length],
  image: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=60`,
  rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
  deliveryTime: `${Math.floor(Math.random() * 30) + 15} min`,
  distance: `${(Math.random() * 5 + 1).toFixed(1)} km`,
  offer: `${Math.floor(Math.random() * 40) + 10}% OFF`,
  address: `Street ${i + 1}, Food City`,
  isOpen: true,
}));

const foodDataTemplate = [
  { name: "Paneer Butter Masala", category: "veg", price: 250 },
  { name: "Chicken Tikka", category: "non-veg", price: 300 },
  { name: "Margherita Pizza", category: "veg", price: 350 },
  { name: "Pasta Alfredo", category: "veg", price: 280 },
  { name: "Mutton Biryani", category: "non-veg", price: 400 },
  { name: "Veg Hakka Noodles", category: "veg", price: 180 },
  { name: "Chilli Chicken", category: "non-veg", price: 260 },
  { name: "Masala Dosa", category: "veg", price: 120 },
  { name: "Chocolate Brownie", category: "veg", price: 150 },
  { name: "Cold Coffee", category: "veg", price: 100 }
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