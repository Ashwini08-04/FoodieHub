const mongoose = require("mongoose")

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      default: 0
    },

    deliveryTime: {
      type: String
    },

    distance: {
      type: String
    },

    offer: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("Restaurant", restaurantSchema)