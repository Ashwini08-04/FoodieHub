import { useEffect, useMemo, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChevronDown,
  faMagnifyingGlass,
  faSliders,
  faXmark,
  faLocationDot,
  faUtensils
} from "@fortawesome/free-solid-svg-icons"
import { Link, useSearchParams } from "react-router-dom"

import RestaurantCard from "../components/RestaurantCard"
import api from "../api/api"

import "./Restaurant.css"

function Restaurant() {
  const [restaurants, setRestaurants] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  )
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("Recommended")
  const [loading, setLoading] = useState(true)

  const categories = [
    "All",
    "Indian",
    "Biryani",
    "Italian",
    "Pizza",
    "Burgers",
    "Chinese",
    "Japanese",
    "Thai",
    "Mughlai",
    "South Indian",
    "Barbeque",
    "Desserts",
    "Street Food"
  ]

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)

        const response = await api.get("/restaurants")

        if (Array.isArray(response.data)) {
          setRestaurants(response.data)
        } else {
          setRestaurants([])
        }
      } catch (error) {
        console.error(
          "Failed to fetch restaurants:",
          error.response?.data || error.message
        )

        setRestaurants([])
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  // Sync search with URL
  useEffect(() => {
    const urlSearch = searchParams.get("search") || ""

    if (urlSearch !== search) {
      setSearch(urlSearch)
    }
  }, [searchParams, search])

  const handleSearch = (value) => {
    setSearch(value)

    if (value.trim()) {
      setSearchParams({ search: value })
    } else {
      setSearchParams({})
    }
  }

  const handleCategory = (item) => {
    setCategory(item)
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("All")
    setSort("Recommended")
    setSearchParams({})
  }

  const filteredRestaurants = useMemo(() => {
    const query = search.toLowerCase().trim()

    const filtered = restaurants.filter((restaurant) => {
      const restaurantCategory =
        restaurant.category?.toLowerCase() || ""

      const searchable = `
        ${restaurant.name || ""}
        ${restaurant.category || ""}
        ${restaurant.cuisines || ""}
        ${(restaurant.tags || []).join(" ")}
      `.toLowerCase()

      const matchesSearch = searchable.includes(query)

      const matchesCategory =
        category === "All" ||
        restaurantCategory.includes(category.toLowerCase())

      return matchesSearch && matchesCategory
    })

    return [...filtered].sort((a, b) => {
      if (sort === "Rating") {
        return Number(b.rating || 0) - Number(a.rating || 0)
      }

      if (sort === "Delivery time") {
        const getMinutes = (time) => {
          const match = String(time || "").match(/\d+/)
          return match ? Number(match[0]) : 999
        }

        return (
          getMinutes(a.deliveryTime) -
          getMinutes(b.deliveryTime)
        )
      }

      if (sort === "Price") {
        const getPrice = (value) => {
          const match = String(value || "")
            .replace(/,/g, "")
            .match(/\d+/)

          return match ? Number(match[0]) : 99999
        }

        return (
          getPrice(a.priceForTwo) -
          getPrice(b.priceForTwo)
        )
      }

      return 0
    })
  }, [restaurants, search, category, sort])

  const hasFilters =
    search.trim() !== "" ||
    category !== "All" ||
    sort !== "Recommended"

  return (
    <main className="restaurant-page">
      <div className="restaurant-container">

        {/* Premium page header */}
        <section className="restaurant-hero">

          <div className="restaurant-hero-content">

            <div className="restaurant-eyebrow">
              <span>
                <FontAwesomeIcon icon={faUtensils} />
              </span>
              Discover your next favourite
            </div>

            <h1>
              Good food.
              <br />
              <span>Great places.</span>
            </h1>

            <p>
              Explore handpicked restaurants and discover
              delicious food made for every craving.
            </p>

            <div className="restaurant-location">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>Delivering fresh food around you</span>
            </div>

          </div>

          <div className="restaurant-hero-stat">
            <strong>{restaurants.length || 0}</strong>
            <span>Restaurants<br />available</span>
          </div>

        </section>

        {/* Search and sorting */}
        <section className="restaurant-toolbar">

          <div className="restaurant-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} />

            <input
              type="text"
              placeholder="Search restaurant, cuisine or dish..."
              value={search}
              onChange={(event) =>
                handleSearch(event.target.value)
              }
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => handleSearch("")}
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>

          <label className="sort-select">
            <FontAwesomeIcon icon={faSliders} />

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
            >
              <option value="Recommended">
                Recommended
              </option>

              <option value="Rating">
                Top rated
              </option>

              <option value="Delivery time">
                Fast delivery
              </option>

              <option value="Price">
                Price: Low to High
              </option>
            </select>

            <FontAwesomeIcon icon={faChevronDown} />
          </label>

        </section>

        {/* Categories */}
        <section className="restaurant-category-section">

          <div className="section-mini-heading">
            <div>
              <span>EXPLORE BY</span>
              <h2>What are you craving?</h2>
            </div>

            <span className="category-count">
              {filteredRestaurants.length} places
            </span>
          </div>

          <div className="restaurant-filters">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item ? "active" : ""
                }
                onClick={() => handleCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

        </section>

        {/* Active filters */}
        {hasFilters && (
          <div className="active-filters">

            <div className="active-filter-left">
              <span className="results-number">
                {filteredRestaurants.length}
              </span>

              <span>matching restaurants</span>
            </div>

            {search && (
              <span className="active-filter">
                "{search}"
              </span>
            )}

            {category !== "All" && (
              <span className="active-filter">
                {category}
              </span>
            )}

            {sort !== "Recommended" && (
              <span className="active-filter">
                {sort}
              </span>
            )}

            <button onClick={clearFilters}>
              <FontAwesomeIcon icon={faXmark} />
              Clear
            </button>

          </div>
        )}

        {/* Restaurant results */}
        <section className="restaurant-results-section">

          {!loading && filteredRestaurants.length > 0 && (
            <div className="results-heading">
              <div>
                <span>FOODIEHUB COLLECTION</span>
                <h2>Restaurants you'll love</h2>
              </div>

              <p>
                {filteredRestaurants.length} restaurants
              </p>
            </div>
          )}

          {loading ? (
            <div className="restaurant-loading">

              <div className="loading-spinner"></div>

              <strong>Finding delicious places...</strong>

              <p>
                We're getting the best restaurants for you.
              </p>

            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="restaurant-grid">

              {filteredRestaurants.map(
                (restaurant, index) => {

                  const restaurantId =
                    restaurant.id || restaurant._id

                  return (
                    <Link
                      to={`/restaurant/${restaurantId}`}
                      key={restaurantId}
                      className="restaurant-result"
                      style={{
                        "--delay": `${index * 45}ms`
                      }}
                    >
                      <RestaurantCard
                        {...restaurant}
                      />
                    </Link>
                  )
                }
              )}

            </div>
          ) : (
            <div className="no-results">

              <div className="no-results-icon">
                🍽️
              </div>

              <span>Nothing delicious here yet</span>

              <h2>No restaurants found</h2>

              <p>
                We couldn't find a restaurant matching your
                current search or filters.
              </p>

              <button onClick={clearFilters}>
                Explore all restaurants
              </button>

            </div>
          )}

        </section>

      </div>
    </main>
  )
}

export default Restaurant