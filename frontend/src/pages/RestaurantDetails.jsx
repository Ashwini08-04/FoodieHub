import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faStar,
  faClock,
  faLocationDot,
  faFire
} from "@fortawesome/free-solid-svg-icons"

import api from "../api/api"
import FoodCard from "../components/FoodCard"

import "./RestaurantDetails.css"

function RestaurantDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [restaurant, setRestaurant] = useState(null)
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true)
        setError("")

        // Get restaurant details
        const restaurantResponse = await api.get(
          `/restaurants/${id}`
        )

        setRestaurant(restaurantResponse.data)

        // Get restaurant food
        const foodResponse = await api.get(
          `/foods/restaurant/${id}`
        )

        setFoods(foodResponse.data)

      } catch (error) {
        console.error(
          "Failed to fetch restaurant details:",
          error.response?.data || error.message
        )

        setError(
          error.response?.data?.message ||
          "Failed to load restaurant"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurantDetails()
  }, [id])

  // Loading
  if (loading) {
    return (
      <div className="restaurant-details-page">
        <p>Loading restaurant... 🍽️</p>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="restaurant-details-page">
        <p className="no-results">
          {error}
        </p>

        <button onClick={() => navigate("/restaurant")}>
          Back to Restaurants
        </button>
      </div>
    )
  }

  // Restaurant not found
  if (!restaurant) {
    return (
      <div className="restaurant-details-page">
        <p className="no-results">
          Restaurant not found 😕
        </p>
      </div>
    )
  }

  return (
    <div className="restaurant-details-page">

      {/* Restaurant Banner */}
      <section className="restaurant-banner">

        <img
          src={restaurant.image}
          alt={restaurant.name}
        />

        <div className="restaurant-overlay">

          {/* Offer */}
          {restaurant.offer && (
            <span className="restaurant-offer">
              <FontAwesomeIcon icon={faFire} />
              {restaurant.offer}
            </span>
          )}

          {/* Restaurant name */}
          <h1>{restaurant.name}</h1>

          {/* Category */}
          <p>{restaurant.category}</p>

          {/* Restaurant Meta */}
          <div className="restaurant-meta">

            <span>
              <FontAwesomeIcon icon={faStar} />
              {restaurant.rating}
            </span>

            <span>
              <FontAwesomeIcon icon={faClock} />
              {restaurant.deliveryTime}
            </span>

            <span>
              <FontAwesomeIcon icon={faLocationDot} />
              {restaurant.distance}
            </span>

          </div>

        </div>

      </section>

      {/* Food Menu */}
      <section className="menu-section">

        <h2>Popular Menu 🍽️</h2>

        {foods.length > 0 ? (

          <div className="cards">

            {foods.map((food) => (

              <FoodCard
                key={food._id}
                id={food._id}
                name={food.name}
                category={food.category}
                price={food.price}
                image={food.image}
              />

            ))}

          </div>

        ) : (

          <p className="no-results">
            No food items available 😕
          </p>

        )}

      </section>

    </div>
  )
}

export default RestaurantDetails