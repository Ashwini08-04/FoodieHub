import { useContext, useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faCartShopping,
  faChevronDown,
  faHome,
  faLocationDot,
  faMagnifyingGlass,
  faUser,
  faXmark
} from "@fortawesome/free-solid-svg-icons"

import { CartContext } from "../context/CartContext"
import "./Navbar.css"

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null")
  const isLoggedIn = Boolean(localStorage.getItem("token"))
  const isPartner = user?.role === "partner"

  const dashboardLabel = isPartner
    ? "Partner Dashboard"
    : "My Dashboard"

  const tabs = [
    { label: "Home", to: "/", icon: faHome },
    { label: "Search", to: "/restaurant", icon: faMagnifyingGlass },
    { label: "Cart", to: "/cart", icon: faCartShopping },
    { label: "Profile", to: "/profile", icon: faUser }
  ]

  const { cartCount } = useContext(CartContext)

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [locationText, setLocationText] = useState("Bengaluru")
  const [searchValue, setSearchValue] = useState("")

  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.pageYOffset > 10)
    }

    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
  }, [pathname])

  const handleSubmit = (event) => {
    event.preventDefault()

    const query = searchValue.trim()

    setMobileOpen(false)

    navigate(
      `/restaurant${
        query ? `?search=${encodeURIComponent(query)}` : ""
      }`
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")

    setProfileOpen(false)
    setMobileOpen(false)

    window.location.href = "/login"
  }

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>

        <div className="navbar-start">

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              icon={mobileOpen ? faXmark : faBars}
            />
          </button>

          <NavLink to="/" className="brand">
            <span>🍔</span>

            <div>
              <strong>Foodie</strong>
              <small>Hub</small>
            </div>
          </NavLink>

        </div>

        <form
          className="navbar-search"
          onSubmit={handleSubmit}
        >

          <label className="location-pill">
            <FontAwesomeIcon icon={faLocationDot} />

            <select
              value={locationText}
              onChange={(event) =>
                setLocationText(event.target.value)
              }
            >
              <option>Bengaluru</option>
              <option>Mumbai</option>
              <option>Delhi NCR</option>
              <option>Hyderabad</option>
              <option>Nagpur</option>
              <option>Pune</option>
              <option>Jalgaon</option>
              <option>Nashik</option>
            </select>

            <FontAwesomeIcon icon={faChevronDown} />
          </label>

          <label className="search-pill">
            <FontAwesomeIcon icon={faMagnifyingGlass} />

            <input
              type="search"
              placeholder="Search restaurants, dishes..."
              value={searchValue}
              onChange={(event) =>
                setSearchValue(event.target.value)
              }
              aria-label="Search"
            />
          </label>

        </form>

        <div className="navbar-actions">

          <NavLink
            to="/restaurant"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Restaurants
          </NavLink>

          <NavLink
            to="/cart"
            className="nav-link cart-link"
          >
            <FontAwesomeIcon icon={faCartShopping} />

            Cart

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </NavLink>

          <div className="profile-menu">

            <button
              type="button"
              onClick={() =>
                setProfileOpen((value) => !value)
              }
              className={profileOpen ? "profile-trigger open" : "profile-trigger"}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="profile-chevron"
              />
            </button>

            {profileOpen && (
              <div className="profile-dropdown">

                {isLoggedIn ? (
                  <>
                    <NavLink
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </NavLink>

                    <NavLink
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                    >
                      {dashboardLabel}
                    </NavLink>

                    <button
                      type="button"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setProfileOpen(false)}
                    >
                      Login
                    </NavLink>

                    <NavLink
                      to="/register"
                      onClick={() => setProfileOpen(false)}
                    >
                      Register
                    </NavLink>
                  </>
                )}

              </div>
            )}

          </div>

        </div>
      </header>

      <nav
        className={`mobile-drawer ${
          mobileOpen ? "open" : ""
        }`}
      >

        <NavLink
          to="/"
          onClick={() => setMobileOpen(false)}
        >
          Home
        </NavLink>

        <NavLink
          to="/restaurant"
          onClick={() => setMobileOpen(false)}
        >
          Restaurants
        </NavLink>

        <NavLink
          to="/cart"
          onClick={() => setMobileOpen(false)}
        >
          Cart
        </NavLink>

        <NavLink
          to={isLoggedIn ? "/profile" : "/login"}
          onClick={() => setMobileOpen(false)}
        >
          {isLoggedIn ? "Profile" : "Login"}
        </NavLink>

      </nav>

      <div className="mobile-bottom-bar">

        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `bottom-tab ${
                isActive ? "active" : ""
              }`
            }
          >
            <FontAwesomeIcon icon={tab.icon} />
            <span>{tab.label}</span>
          </NavLink>
        ))}

      </div>
    </>
  )
}

export default Navbar