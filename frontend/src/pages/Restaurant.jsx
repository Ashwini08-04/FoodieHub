import { useEffect, useMemo, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons"
import { Link, useSearchParams } from "react-router-dom"
import RestaurantCard from "../components/RestaurantCard"
import api from "../api/api"
import { demoRestaurants } from "../data/demoData"
import "./Restaurant.css"

function Restaurant() {
  const [restaurants, setRestaurants] = useState(demoRestaurants)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("Recommended")

  useEffect(() => {
    let mounted = true
    api.get("/restaurants")
      .then(({ data }) => {
        if (mounted && Array.isArray(data) && data.length) setRestaurants(data)
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  const filteredRestaurants = useMemo(() => restaurants
    .filter((restaurant) => {
      const query = search.toLowerCase().trim()
      const searchable = `${restaurant.name} ${restaurant.category} ${restaurant.cuisines || ""}`.toLowerCase()
      return searchable.includes(query) && (category === "All" || restaurant.category?.includes(category))
    })
    .sort((a, b) => sort === "Rating" ? Number(b.rating) - Number(a.rating) : sort === "Delivery time" ? a.deliveryTime.localeCompare(b.deliveryTime) : 0), [restaurants, search, category, sort])

  return (
    <main className="restaurant">
      <div className="restaurant-intro">
        <div><span className="eyebrow">Discover & enjoy</span><h1>Restaurants near you</h1><p>The best flavours in Bengaluru, delivered with love.</p></div>
        <div className="result-count"><strong>{filteredRestaurants.length}</strong><span>places to eat</span></div>
      </div>
      <div className="restaurant-toolbar">
        <div className="restaurant-search"><FontAwesomeIcon icon={faMagnifyingGlass} /><input type="text" placeholder="Search restaurant or cuisine" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className="restaurant-filters">
          {["All", "Italian", "Fast Food", "Indian"].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <label className="sort-select"><FontAwesomeIcon icon={faSliders} /><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Recommended</option><option>Rating</option><option>Delivery time</option></select><FontAwesomeIcon icon={faChevronDown} /></label>
      </div>
      <div className="restaurant-grid">
        {filteredRestaurants.map((restaurant, index) => <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id} className="restaurant-result" style={{ "--delay": `${index * 70}ms` }}><RestaurantCard {...restaurant} /></Link>)}
      </div>
      {filteredRestaurants.length === 0 && <div className="no-results"><div>🍽️</div><h2>No restaurants found</h2><p>Try a different cuisine or clear your search.</p><button onClick={() => { setSearch(""); setCategory("All") }}>Clear filters</button></div>}
    </main>
  )
}

export default Restaurant
