const sequelize = require("../config/database");

const User = require("./User");
const Restaurant = require("./Restaurant");
const Food = require("./Food");
const Order = require("./Order");

// Define Associations

// A User (Admin) can own many Restaurants
User.hasMany(Restaurant, { foreignKey: "ownerId", as: "restaurants" });
Restaurant.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// A Restaurant can have many Food items
Restaurant.hasMany(Food, { foreignKey: "restaurantId", as: "menu" });
Food.belongsTo(Restaurant, { foreignKey: "restaurantId", as: "restaurant" });

// A User can have many Orders
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  sequelize,
  User,
  Restaurant,
  Food,
  Order,
};
