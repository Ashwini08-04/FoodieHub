import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMagnifyingGlass,
  faPizzaSlice,
  faBurger,
  faBowlFood
} from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate } from "react-router-dom"
import RestaurantCard from "../components/RestaurantCard"
import "./Home.css"

function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/restaurant?search=${search}`)
    } else {
      navigate("/restaurant")
    }
  }

  return (
    <div className="home">

      {/* Hero section */}
      <section className="hero">

        <div className="hero-content">

          <span className="hero-tag">
            🍴 Fresh food, delivered to your door
          </span>

          <h1>
            Delicious Food,
            <br />
            Delivered Fast 🚀
          </h1>

          <p>
            Discover the best restaurants and delicious meals
            near you.
          </p>

          {/* Search */}
          <div className="search-box">

            <FontAwesomeIcon icon={faMagnifyingGlass} />

            <input
              type="text"
              placeholder="Search for food or restaurant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
            />

            <button onClick={handleSearch}>
              Search
            </button>

          </div>

        </div>

      </section>

      {/* Food categories */}
      <section className="categories">

        <h2>Popular Categories</h2>

        <div className="category-list">

          <div onClick={() => navigate("/restaurant?search=Pizza")}>
            <FontAwesomeIcon icon={faPizzaSlice} />
            <span>Pizza</span>
          </div>

          <div onClick={() => navigate("/restaurant?search=Burger")}>
            <FontAwesomeIcon icon={faBurger} />
            <span>Burger</span>
          </div>

          <div onClick={() => navigate("/restaurant?search=Chinese")}>
            <FontAwesomeIcon icon={faBowlFood} />
            <span>Chinese</span>
          </div>

          <div onClick={() => navigate("/restaurant?search=Indian")}>
            <FontAwesomeIcon icon={faBowlFood} />
            <span>Indian</span>
          </div>

        </div>

      </section>

      {/* Popular Restaurants */}
      <section className="restaurants">

        <h2>Popular Restaurants</h2>

        <div className="cards">

          <Link to="/restaurant/1">
            <RestaurantCard
              name="Pizza House"
              category="Italian Food"
              image="/images/pizza-house.jpg"
              rating="4.5"
              deliveryTime="20-30 min"
              distance="2.5 km"
              offer="20% OFF"
            />
          </Link>

          <Link to="/restaurant/2">
            <RestaurantCard
              name="Burger Point"
              category="Fast Food"
              image="/images/burger-point.jpg"
              rating="4.6"
              deliveryTime="15-25 min"
              distance="1.8 km"
              offer="15% OFF"
            />
          </Link>

          <Link to="/restaurant/3">
            <RestaurantCard
              name="Food Corner"
              category="Indian Food"
              image="/images/food-corner.jpg"
              rating="4.4"
              deliveryTime="25-35 min"
              distance="3.1 km"
              offer="10% OFF"
            />
          </Link>

        </div>

      </section>

    </div>
  )
}

export default Home