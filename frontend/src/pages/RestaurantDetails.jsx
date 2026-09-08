import { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faStar,
  faClock,
  faLocationDot,
  faFire,
  faArrowLeft,
  faUtensils,
  faMagnifyingGlass,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons"

import api from "../api/api"
import FoodCard from "../components/FoodCard"
import { demoFoods, demoRestaurants } from "../data/demoData"

import "./RestaurantDetails.css"

function RestaurantDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [restaurant, setRestaurant] = useState(null)
  const [foods, setFoods] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true)
        setError("")

        const restaurantResponse = await api.get(
          `/restaurants/${id}`
        )

        if (
          !restaurantResponse.data ||
          typeof restaurantResponse.data !== "object" ||
          Array.isArray(restaurantResponse.data)
        ) {
          throw new Error("Restaurant API unavailable")
        }

        setRestaurant(restaurantResponse.data)

        const foodResponse = await api.get(
          `/foods/restaurant/${id}`
        )

        setFoods(
          Array.isArray(foodResponse.data)
            ? foodResponse.data
            : []
        )
      } catch (error) {
        console.error(
          "Failed to fetch restaurant details:",
          error.response?.data || error.message
        )

        const fallbackRestaurant =
          demoRestaurants.find(
            (item) =>
              item.id === id ||
              item._id === id
          )

        if (fallbackRestaurant) {
          setRestaurant(fallbackRestaurant)

          setFoods(
            demoFoods[id] ||
            demoFoods[fallbackRestaurant.id] ||
            demoFoods[fallbackRestaurant._id] ||
            []
          )

          setError("")
        } else {
          setError(
            error.response?.data?.message ||
            "Failed to load restaurant"
          )
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurantDetails()
  }, [id])

  const filteredFoods = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) {
      return foods
    }

    return foods.filter((food) => {
      const searchable = `
        ${food.name || ""}
        ${food.category || ""}
        ${food.description || ""}
      `.toLowerCase()

      return searchable.includes(query)
    })
  }, [foods, search])

  if (loading) {
    return (
      <main className="restaurant-details-page">
        <div className="details-loading">
          <div className="details-spinner"></div>
          <strong>Preparing your menu...</strong>
          <p>Finding the best dishes for you.</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="restaurant-details-page">
        <div className="details-error">
          <div className="details-error-icon">🍽️</div>

          <h2>Oops! Something went wrong</h2>

          <p>{error}</p>

          <button onClick={() => navigate("/restaurant")}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Restaurants
          </button>
        </div>
      </main>
    )
  }

  if (!restaurant) {
    return (
      <main className="restaurant-details-page">
        <div className="details-error">
          <div className="details-error-icon">🔍</div>

          <h2>Restaurant not found</h2>

          <p>
            We couldn't find the restaurant you're looking for.
          </p>

          <button onClick={() => navigate("/restaurant")}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Explore Restaurants
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="restaurant-details-page">

      <div className="restaurant-details-container">

        {/* Back navigation */}
        <button
          className="details-back"
          onClick={() => navigate("/restaurant")}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to restaurants
        </button>

        {/* Restaurant Hero */}
        <section className="restaurant-detail-hero">

          <div className="detail-image-wrapper">

            <img
              src={
                restaurant.image?.startsWith("http")
                  ? restaurant.image
                  : restaurant.image
                    ? restaurant.image.startsWith("/")
                      ? restaurant.image
                      : `/${restaurant.image}`
                    : "/images/pizza-house.jpg"
              }
              alt={restaurant.name}
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src =
                  "/images/pizza-house.jpg"
              }}
            />

            <div className="detail-image-overlay"></div>

            {restaurant.offer && (
              <span className="detail-offer">
                <FontAwesomeIcon icon={faFire} />
                {restaurant.offer}
              </span>
            )}

          </div>

          <div className="detail-info">

            <div className="detail-kicker">
              <FontAwesomeIcon icon={faUtensils} />
              FoodieHub restaurant
            </div>

            <h1>{restaurant.name}</h1>

            <p className="detail-category">
              {restaurant.category}
            </p>

            <p className="detail-description">
              Enjoy delicious food, carefully prepared with
              quality ingredients and delivered fresh to your
              doorstep.
            </p>

            <div className="detail-stats">

              <div className="detail-stat rating-stat">
                <span className="stat-icon">
                  <FontAwesomeIcon icon={faStar} />
                </span>

                <div>
                  <strong>{restaurant.rating || "4.5"}</strong>
                  <small>Rating</small>
                </div>
              </div>

              <div className="detail-stat">
                <span className="stat-icon">
                  <FontAwesomeIcon icon={faClock} />
                </span>

                <div>
                  <strong>
                    {restaurant.deliveryTime || "25-35 min"}
                  </strong>
                  <small>Delivery</small>
                </div>
              </div>

              <div className="detail-stat">
                <span className="stat-icon">
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>

                <div>
                  <strong>
                    {restaurant.distance || "Nearby"}
                  </strong>
                  <small>Distance</small>
                </div>
              </div>

            </div>

            <div className="detail-address">
              <FontAwesomeIcon icon={faLocationDot} />

              <div>
                <span>Delivery location</span>
                <strong>
                  {restaurant.address ||
                    "Available in your area"}
                </strong>
              </div>
            </div>

          </div>

        </section>

        {/* Restaurant highlights */}
        <section className="restaurant-highlights">

          <div>
            <FontAwesomeIcon icon={faCircleCheck} />
            <span>Freshly prepared</span>
          </div>

          <div>
            <FontAwesomeIcon icon={faCircleCheck} />
            <span>Fast delivery</span>
          </div>

          <div>
            <FontAwesomeIcon icon={faCircleCheck} />
            <span>Quality ingredients</span>
          </div>

          <div>
            <FontAwesomeIcon icon={faCircleCheck} />
            <span>Secure ordering</span>
          </div>

        </section>

        {/* Menu header */}
        <section className="menu-header">

          <div>
            <span className="menu-eyebrow">
              OUR MENU
            </span>

            <h2>
              What are you
              <span> craving?</span>
            </h2>

            <p>
              Explore our popular dishes and add your
              favourites to cart.
            </p>
          </div>

          <div className="menu-count">
            <strong>{foods.length}</strong>
            <span>dishes</span>
          </div>

        </section>

        {/* Food search */}
        <div className="menu-search">

          <FontAwesomeIcon icon={faMagnifyingGlass} />

          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear dish search"
            >
              ×
            </button>
          )}

        </div>

        {/* Food menu */}
        {filteredFoods.length > 0 ? (

          <section className="food-menu-grid">

            {filteredFoods.map((food) => (

              <FoodCard
  key={food.id}
  id={food.id}
  name={food.name}
  category={food.category}
  description={food.description}
  price={food.price}
  image={food.image}
  rating={food.rating}
  bestseller={food.rating >= 4.7}
  restaurantId={restaurant.id || restaurant._id}
  restaurantName={restaurant.name}
  offer={restaurant.offer}
/>

            ))}

          </section>

        ) : (

          <div className="menu-empty">

            <div className="menu-empty-icon">
              🍽️
            </div>

            <h3>
              No dishes found
            </h3>

            <p>
              Try searching for another dish.
            </p>

            {search && (
              <button onClick={() => setSearch("")}>
                Show all dishes
              </button>
            )}

          </div>

        )}

      </div>

    </main>
  )
}
export default RestaurantDetails