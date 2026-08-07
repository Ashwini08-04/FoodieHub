import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { Link, useSearchParams } from "react-router-dom"

import RestaurantCard from "../components/RestaurantCard"
import api from "../api/api"

import "./Restaurant.css"

function Restaurant() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchParams] = useSearchParams()

  const initialSearch = searchParams.get("search") || ""

  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState("All")

  // Fetch restaurants from backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await api.get("/restaurants")

        setRestaurants(response.data)
      } catch (error) {
        console.error("Failed to fetch restaurants:", error)

        setError("Failed to load restaurants")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  // Update search when URL search changes
  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch])

  // Search + category filter
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const text = search.toLowerCase().trim()

    const restaurantName =
      restaurant.name?.toLowerCase() || ""

    const restaurantCategory =
      restaurant.category?.toLowerCase() || ""

    const matchesSearch =
      restaurantName.includes(text) ||
      restaurantCategory.includes(text)

    const matchesCategory =
      category === "All" ||
      restaurant.category === category

    return matchesSearch && matchesCategory
  })

  // Loading
  if (loading) {
    return (
      <div className="restaurant">
        <h1>Popular Restaurants 🍽️</h1>

        <p>
          Loading restaurants...
        </p>
      </div>
    )
  }

  // API Error
  if (error) {
    return (
      <div className="restaurant">
        <h1>Popular Restaurants 🍽️</h1>

        <p className="no-results">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="restaurant">

      <h1>
        Popular Restaurants 🍽️
      </h1>

      {/* Search */}
      <div className="restaurant-search">

        <FontAwesomeIcon
          icon={faMagnifyingGlass}
        />

        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Categories */}
      <div className="restaurant-filters">

        {[
          "All",
          "Italian Food",
          "Fast Food",
          "Indian Food"
        ].map((item) => (

          <button
            key={item}
            className={
              category === item
                ? "active"
                : ""
            }
            onClick={() => setCategory(item)}
          >
            {item}
          </button>

        ))}

      </div>

      {/* Restaurant Cards */}
      <div className="cards">

        {filteredRestaurants.map((restaurant) => (

          <Link
            to={`/restaurant/${restaurant._id}`}
            key={restaurant._id}
          >

            <RestaurantCard
              name={restaurant.name}
              category={restaurant.category}
              image={restaurant.image}
              rating={restaurant.rating}
              deliveryTime={restaurant.deliveryTime}
              distance={restaurant.distance}
              offer={restaurant.offer}
            />

          </Link>

        ))}

      </div>

      {/* No Results */}
      {filteredRestaurants.length === 0 && (

        <p className="no-results">
          No restaurants found 😕
        </p>

      )}

    </div>
  )
}

export default Restaurant