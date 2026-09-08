import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faChevronRight,
  faMagnifyingGlass,
  faMotorcycle,
  faPercent,
  faShieldHeart,
  faStar,
  faUtensils,
  faLocationDot,
  faBolt
} from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate } from "react-router-dom"

import RestaurantCard from "../components/RestaurantCard"
import { categoryOptions } from "../data/demoData"
import api from "../api/api"

import "./Home.css"

function Home() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("Bengaluru")
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)

        const response = await api.get("/restaurants")

        if (Array.isArray(response.data)) {
          setFeatured(response.data.slice(0, 3))
        } else {
          setFeatured([])
        }
      } catch (error) {
        console.error(
          "Failed to fetch restaurants:",
          error.response?.data || error.message
        )

        setFeatured([])
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  const handleSearch = (event) => {
    event?.preventDefault()

    navigate(
      `/restaurant${
        search.trim()
          ? `?search=${encodeURIComponent(search.trim())}`
          : ""
      }`
    )
  }

  return (
    <main className="home">

      {/* Hero */}
      <section className="hero">

        <div className="hero-background-shape shape-one"></div>
        <div className="hero-background-shape shape-two"></div>
        <div className="hero-grid-pattern"></div>

        <div className="hero-content">

          <div className="eyebrow light-eyebrow">
            <span className="pulse-dot"></span>
            India&apos;s favourite food delivery app
          </div>

          <h1>
            Cravings made
            <span> deliciously easy.</span>
          </h1>

          <p>
            Discover handpicked restaurants, explore delicious dishes,
            and get your favourite food delivered fresh to your doorstep.
          </p>

          <form
            className="search-box"
            onSubmit={handleSearch}
          >
            <div className="location-picker">
              <FontAwesomeIcon icon={faLocationDot} />

              <select
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                aria-label="Choose location"
              >
                <option>Bengaluru</option>
                <option>Mumbai</option>
                <option>Delhi NCR</option>
                <option>Hyderabad</option>
                <option>Pune</option>
                <option>Nagpur</option>
                <option>Chennai</option>
                <option>Kolkata</option>
                <option>Ahmedabad</option>
                <option>Jaipur</option>
                <option>Surat</option>
                <option>Nashik</option>
                <option>Indore</option>
                <option>Chandigarh</option>
                <option>Lucknow</option>
                <option>Kochi</option>
              </select>
            </div>

            <span className="search-divider"></span>

            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="search-icon"
            />

            <input
              type="text"
              placeholder="Search restaurants, cuisine or dish"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <button type="submit">
              Search
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </form>

          <div className="hero-trust">

            <span>
              <FontAwesomeIcon icon={faStar} />
              4.8/5 app rating
            </span>

            <span>
              <FontAwesomeIcon icon={faBolt} />
              30 min average delivery
            </span>

            <span>
              <FontAwesomeIcon icon={faShieldHeart} />
              Trusted restaurants
            </span>

          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-card hero-card-main">
            <div className="hero-food-image">
              🍛
            </div>

            <div className="hero-card-info">
              <span>Today&apos;s craving</span>
              <strong>Authentic Indian</strong>

              <div>
                <FontAwesomeIcon icon={faStar} />
                <span>4.9</span>
                <small> · 25 min</small>
              </div>
            </div>
          </div>

          <div className="floating-food floating-food-one">
            🥟
          </div>

          <div className="floating-food floating-food-two">
            🍕
          </div>

          <div className="hero-delivery-card">
            <span className="delivery-icon">
              <FontAwesomeIcon icon={faMotorcycle} />
            </span>

            <div>
              <strong>Fast delivery</strong>
              <small>At your doorstep</small>
            </div>
          </div>

        </div>

      </section>

      {/* Categories */}
      <section className="home-section category-section">

        <div className="section-heading">

          <div>
            <span className="eyebrow">
              Explore the menu
            </span>

            <h2>What are you craving?</h2>

            <p>
              Pick your favourite and discover something delicious.
            </p>
          </div>

          <Link
            to="/restaurant"
            className="text-link"
          >
            View all
            <FontAwesomeIcon icon={faChevronRight} />
          </Link>

        </div>

        <div className="category-list">

          {categoryOptions.map((category, index) => (
            <button
              className="category-tile"
              style={{
                "--category-tone": category.tone,
                "--delay": `${index * 70}ms`
              }}
              key={category.label}
              onClick={() =>
                navigate(
                  `/restaurant?search=${encodeURIComponent(
                    category.label
                  )}`
                )
              }
            >
              <span className="category-emoji">
                {category.emoji}
              </span>

              <span className="category-name">
                {category.label}
              </span>

              <small>
                Explore
                <FontAwesomeIcon icon={faArrowRight} />
              </small>
            </button>
          ))}

        </div>

      </section>

      {/* Featured Restaurants */}
      <section className="home-section featured-section">

        <div className="section-heading">

          <div>
            <span className="eyebrow">
              Handpicked for you
            </span>

            <h2>Popular near you</h2>

            <p>
              Loved by foodies and ready to serve.
            </p>
          </div>

          <Link
            to="/restaurant"
            className="text-link"
          >
            See all restaurants
            <FontAwesomeIcon icon={faChevronRight} />
          </Link>

        </div>

        {loading ? (
          <div className="restaurant-loading">
            <div className="loading-spinner"></div>
            <p>Finding delicious places...</p>
          </div>
        ) : featured.length > 0 ? (
          <div className="cards">

            {featured.map((restaurant, index) => {

              const restaurantId =
                restaurant.id || restaurant._id

              return (
                <Link
                  className="restaurant-link"
                  to={`/restaurant/${restaurantId}`}
                  key={restaurantId}
                  style={{
                    "--delay": `${index * 90}ms`
                  }}
                >
                  <RestaurantCard
                    {...restaurant}
                  />
                </Link>
              )
            })}

          </div>
        ) : (
          <div className="no-results">

            <div className="no-results-icon">
              <FontAwesomeIcon icon={faUtensils} />
            </div>

            <h2>No restaurants available</h2>

            <p>
              We couldn&apos;t load restaurants right now.
            </p>

            <button
              onClick={() => navigate("/restaurant")}
            >
              Explore restaurants
            </button>

          </div>
        )}

      </section>

      {/* Benefits */}
      <section className="perks-section">

        <div className="perk">

          <span>
            <FontAwesomeIcon icon={faMotorcycle} />
          </span>

          <div>
            <strong>Lightning-fast delivery</strong>
            <p>Hot meals, right on time.</p>
          </div>

        </div>

        <div className="perk">

          <span>
            <FontAwesomeIcon icon={faShieldHeart} />
          </span>

          <div>
            <strong>Quality you can trust</strong>
            <p>Curated restaurants only.</p>
          </div>

        </div>

        <div className="perk">

          <span>
            <FontAwesomeIcon icon={faPercent} />
          </span>

          <div>
            <strong>Deals every day</strong>
            <p>More food, less spend.</p>
          </div>

        </div>

      </section>

      {/* Final CTA */}
      <section className="home-cta">

        <div className="cta-content">

          <span className="eyebrow">
            Your next favourite meal
          </span>

          <h2>
            Hungry? Let&apos;s find
            <span> something delicious.</span>
          </h2>

          <p>
            Explore restaurants, discover new flavours and order
            everything you love in just a few clicks.
          </p>

          <button
            onClick={() => navigate("/restaurant")}
          >
            Explore restaurants
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

        </div>

        <div className="cta-food">
          🍜
        </div>

      </section>

    </main>
  )
}

export default Home