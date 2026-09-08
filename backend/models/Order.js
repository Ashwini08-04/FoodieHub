const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  items: {
    type: DataTypes.JSON,
    allowNull: false
  },

  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },

  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },

  deliveryFee: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },

  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  offerApplied: {
    type: DataTypes.STRING,
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM(
      "placed",
      "confirmed",
      "preparing",
      "out for delivery",
      "delivered"
    ),
    defaultValue: "placed"
  },

  deliveryAddress: {
    type: DataTypes.JSON,
    allowNull: true
  }
})

module.exports = Order