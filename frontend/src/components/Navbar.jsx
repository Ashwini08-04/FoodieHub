import { useContext, useEffect, useMemo, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faCartShopping,
  faChevronDown,
  faHome,
  faLocationDot,
  faMagnifyingGlass,
  faStore,
  faUser,
  faXmark,
  faUserAstronaut,
  faUserShield,
  faRightFromBracket,
  faClipboardList
} from "@fortawesome/free-solid-svg-icons"
import { CartContext } from "../context/CartContext"
import "./Navbar.css"

const tabs = [
  { label: "Home", to: "/", icon: faHome },
  { label: "Search", to: "/restaurant", icon: faMagnifyingGlass },
  { label: "Orders", to: "/dashboard", icon: faClipboardList },
  { label: "Cart", to: "/cart", icon: faCartShopping },
  { label: "Profile", to: "/profile", icon: faUser }
]

function Navbar() {
  const { cart, cartCount } = useContext(CartContext)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [locationText, setLocationText] = useState("Bengaluru")
  const [searchValue, setSearchValue] = useState("")
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLabel = useMemo(() => pathname === "/" ? "Home" : pathname.replace("/", "") || "Home", [pathname])

  const handleSubmit = (event) => {
    event.preventDefault()
    const query = searchValue.trim()
    setMobileOpen(false)
    navigate(`/restaurant${query ? `?search=${encodeURIComponent(query)}` : ""}`)
  }

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-start">
          <button className="mobile-menu-toggle" onClick={() => setMobileOpen((value) => !value)}>
            <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} />
          </button>
          <NavLink to="/" className="brand">
            <span>🍔</span>
            <div>
              <strong>Foodie</strong>
              <small>Hub</small>
            </div>
          </NavLink>
        </div>

        <form className="navbar-search" onSubmit={handleSubmit}>
          <label className="location-pill">
            <FontAwesomeIcon icon={faLocationDot} />
            <select value={locationText} onChange={(event) => setLocationText(event.target.value)}>
              <option>Bengaluru</option>
              <option>Mumbai</option>
              <option>Delhi NCR</option>
              <option>Hyderabad</option>
            </select>
            <FontAwesomeIcon icon={faChevronDown} />
          </label>
          <label className="search-pill">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              type="search"
              placeholder="Search restaurants, dishes..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              aria-label="Search"
            />
          </label>
        </form>

        <div className="navbar-actions">
          <NavLink to="/restaurant" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Restaurants
          </NavLink>
          <NavLink to="/cart" className="nav-link cart-link">
            <FontAwesomeIcon icon={faCartShopping} />
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
          <div className="profile-menu">
            <button type="button" onClick={() => setProfileOpen((value) => !value)}>
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </button>
            {profileOpen && (
              <div className="profile-dropdown">
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/register">Register</NavLink>
                <button type="button">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <NavLink to="/" onClick={() => setMobileOpen(false)}>Home</NavLink>
        <NavLink to="/restaurant" onClick={() => setMobileOpen(false)}>Restaurants</NavLink>
        <NavLink to="/cart" onClick={() => setMobileOpen(false)}>Cart</NavLink>
        <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
        <NavLink to="/login" onClick={() => setMobileOpen(false)}>Login</NavLink>
      </nav>

      <div className="mobile-bottom-bar">
        {tabs.map((tab) => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `bottom-tab ${isActive ? "active" : ""}`}>
            <FontAwesomeIcon icon={tab.icon} />
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  )
}

export default Navbar
