import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLocationDot,
  faEnvelope,
  faPhone,
  faGlobe
} from "@fortawesome/free-solid-svg-icons"

import "./Footer.css"

function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-container">

        <div className="footer-top">

          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-mark">F</span>
              <span>
                Foodie<span>Hub</span>
              </span>
            </Link>

            <p>
              Discover delicious food, explore amazing restaurants,
              and get your favourite meals delivered fresh to your door.
            </p>

            <div className="footer-contact">
              <span>
                <FontAwesomeIcon icon={faLocationDot} />
                India
              </span>

              <span>
                <FontAwesomeIcon icon={faEnvelope} />
                hello@foodiehub.com
              </span>
            </div>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/restaurant">Restaurants</Link>
            <Link to="/restaurant">Popular Food</Link>
            <Link to="/restaurant">Offers</Link>
          </div>

          <div className="footer-column">
            <h3>FoodieHub</h3>
            <Link to="/profile">My Profile</Link>
            <Link to="/cart">My Cart</Link>
            <Link to="/dashboard">My Orders</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Privacy Policy</a>
          </div>

        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">

          <div className="footer-copyright">
            <span>© 2026 FoodieHub</span>
            <span className="footer-dot">•</span>
            <span>Made with love for food lovers.</span>
          </div>

          <div className="footer-socials">
            <a href="#" aria-label="Website">
              <FontAwesomeIcon icon={faGlobe} />
            </a>

            <a href="#" aria-label="Contact">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>

            <a href="#" aria-label="Phone">
              <FontAwesomeIcon icon={faPhone} />
            </a>
          </div>

        </div>

      </div>
    </footer>
  )
}

export default Footer