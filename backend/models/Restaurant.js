const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Restaurant = sequelize.define("Restaurant", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  deliveryTime: {
    type: DataTypes.STRING,
  },
  distance: {
    type: DataTypes.STRING,
  },
  offer: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  isOpen: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Restaurant;