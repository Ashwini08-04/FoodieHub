import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHouse,
  faUtensils,
  faCartShopping,
  faRightToBracket,
  faUserPlus,
  faStore
} from "@fortawesome/free-solid-svg-icons"
import { CartContext } from "../context/CartContext"
import "./Navbar.css"

function Navbar() {
  const { cart } = useContext(CartContext)

  // Total cart items
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <nav className="navbar">

      {/* Logo */}
      <NavLink to="/" className="logo">
        🍔 FoodieHub
      </NavLink>

      <div className="nav-links">

        <NavLink to="/">
          <FontAwesomeIcon icon={faHouse} />
          Home
        </NavLink>

        <NavLink to="/restaurant">
          <FontAwesomeIcon icon={faUtensils} />
          Restaurants
        </NavLink>

        <NavLink to="/cart" className="cart-link">
          <FontAwesomeIcon icon={faCartShopping} />
          Cart

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </NavLink>

        <NavLink to="/dashboard" className="partner-link">
          <FontAwesomeIcon icon={faStore} />
          For partners
        </NavLink>

        <NavLink to="/login">
          <FontAwesomeIcon icon={faRightToBracket} />
          Login
        </NavLink>

        <NavLink to="/register">
          <FontAwesomeIcon icon={faUserPlus} />
          Register
        </NavLink>

      </div>

    </nav>
  )
}

export default Navbar