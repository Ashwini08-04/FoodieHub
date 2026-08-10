import { useMemo, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faChevronRight,
  faMagnifyingGlass,
  faMotorcycle,
  faPercent,
  faShieldHeart,
  faStar,
} from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate } from "react-router-dom"
import RestaurantCard from "../components/RestaurantCard"
import { categoryOptions, demoRestaurants } from "../data/demoData"
import "./Home.css"

function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("Bengaluru")

  const featured = useMemo(() => demoRestaurants.slice(0, 3), [])

  const handleSearch = (event) => {
    event?.preventDefault()
    navigate(`/restaurant${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`)
  }

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-content">
          <div className="eyebrow light-eyebrow"><span className="pulse-dot" /> India&apos;s favourite food delivery app</div>
          <h1>Good food.<br /><em>Good mood.</em></h1>
          <p>Discover the best food and drinks from local favourites, delivered fresh to your doorstep.</p>
          <form className="search-box" onSubmit={handleSearch}>
            <div className="location-picker">
              <span className="location-pin">⌖</span>
              <select value={location} onChange={(event) => setLocation(event.target.value)} aria-label="Choose location">
                <option>Bengaluru</option>
                <option>Mumbai</option>
                <option>Delhi NCR</option>
                <option>Hyderabad</option>
              </select>
            </div>
            <span className="search-divider" />
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              type="text"
              placeholder="Search for restaurant, cuisine or dish"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit"><span>Search</span><FontAwesomeIcon icon={faArrowRight} /></button>
          </form>
          <div className="hero-trust">
            <span><FontAwesomeIcon icon={faStar} /> 4.8/5 app rating</span>
            <span><FontAwesomeIcon icon={faMotorcycle} /> 30 min average delivery</span>
          </div>
        </div>
        <div className="hero-food hero-food-main">🍜</div>
        <div className="hero-food hero-food-small">🥟</div>
      </section>

      <section className="home-section category-section">
        <div className="section-heading">
          <div><span className="eyebrow">Explore the menu</span><h2>What are you craving?</h2></div>
          <Link to="/restaurant" className="text-link">View all <FontAwesomeIcon icon={faChevronRight} /></Link>
        </div>
        <div className="category-list">
          {categoryOptions.map((category, index) => (
            <button
              className="category-tile"
              style={{ "--category-tone": category.tone, "--delay": `${index * 70}ms` }}
              key={category.label}
              onClick={() => navigate(`/restaurant?search=${category.label}`)}
            >
              <span className="category-emoji">{category.emoji}</span>
              <span>{category.label}</span>
              <small>Explore</small>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section featured-section">
        <div className="section-heading">
          <div><span className="eyebrow">Handpicked for you</span><h2>Popular near you</h2></div>
          <Link to="/restaurant" className="text-link">See all restaurants <FontAwesomeIcon icon={faChevronRight} /></Link>
        </div>
        <div className="cards">
          {featured.map((restaurant, index) => (
            <Link className="restaurant-link" to={`/restaurant/${restaurant._id}`} key={restaurant._id} style={{ "--delay": `${index * 90}ms` }}>
              <RestaurantCard {...restaurant} />
            </Link>
          ))}
        </div>
      </section>

      <section className="perks-section">
        <div className="perk"><span><FontAwesomeIcon icon={faMotorcycle} /></span><div><strong>Lightning-fast delivery</strong><p>Hot meals, right on time.</p></div></div>
        <div className="perk"><span><FontAwesomeIcon icon={faShieldHeart} /></span><div><strong>Quality you can trust</strong><p>Curated restaurants only.</p></div></div>
        <div className="perk"><span><FontAwesomeIcon icon={faPercent} /></span><div><strong>Deals every day</strong><p>More food, less spend.</p></div></div>
      </section>
    </main>
  )
}

export default Home