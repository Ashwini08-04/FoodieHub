import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faEnvelope,
  faLocationDot,
  faShieldHalved,
  faStore,
  faReceipt,
  faArrowRight,
  faRightFromBracket,
  faCrown,
  faBagShopping,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons"

import api from "../api/api"
import "./Profile.css"

function Profile() {
  const navigate = useNavigate()

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null
    } catch {
      return null
    }
  })

  const [partnerRestaurants, setPartnerRestaurants] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)

  const isPartner = user?.role === "partner"

  useEffect(() => {
    if (!isPartner) return

    setLoading(true)

    api.get("/restaurants/owner")
      .then((res) => setPartnerRestaurants(res.data || []))
      .catch(() => setPartnerRestaurants([]))
      .finally(() => setLoading(false))
  }, [isPartner])

  useEffect(() => {
    if (isPartner) return

    setOrdersLoading(true)

    api.get("/orders/my-orders")
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false))
  }, [isPartner])

  const initials = useMemo(() => {
    if (!user?.name) return "U"

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }, [user])

  const totalSpent = useMemo(() => {
    return orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    )
  }, [orders])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    navigate("/login")
  }

  if (!user) {
    return (
      <main className="profile-page profile-empty-page">
        <div className="profile-empty-card">
          <div className="profile-empty-icon">
            <FontAwesomeIcon icon={faUser} />
          </div>

          <h1>Your profile awaits</h1>

          <p>
            Login to manage your account, track orders and
            enjoy a smoother FoodieHub experience.
          </p>

          <Link to="/login" className="profile-primary-btn">
            Login to FoodieHub
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="profile-page">

      <div className="profile-container">

        <section className="profile-cover">

          <div className="profile-cover-content">

            <div className="profile-avatar">
              {initials}
            </div>

            <div className="profile-intro">
              <span className="profile-kicker">
                <FontAwesomeIcon icon={faCrown} />
                {isPartner ? "FoodieHub Partner" : "FoodieHub Member"}
              </span>

              <h1>{user.name}</h1>

              <p>
                {isPartner
                  ? "Manage your restaurant presence and keep your food business growing."
                  : "Your food journey, orders and account details — all in one place."
                }
              </p>
            </div>

            <button
              className="profile-logout"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </button>

          </div>

          <div className="profile-cover-glow"></div>

        </section>

        <section className="profile-stats">

          <div className="profile-stat">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBagShopping} />
            </div>

            <div>
              <strong>
                {isPartner
                  ? partnerRestaurants.length
                  : orders.length
                }
              </strong>

              <span>
                {isPartner
                  ? "Restaurants"
                  : "Orders placed"
                }
              </span>
            </div>
          </div>

          <div className="profile-stat">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faReceipt} />
            </div>

            <div>
              <strong>
                {isPartner
                  ? "Active"
                  : `₹${totalSpent.toLocaleString("en-IN")}`
                }
              </strong>

              <span>
                {isPartner
                  ? "Partner account"
                  : "Total spent"
                }
              </span>
            </div>
          </div>

          <div className="profile-stat">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faCircleCheck} />
            </div>

            <div>
              <strong>Active</strong>
              <span>Account status</span>
            </div>
          </div>

        </section>

        <section className="profile-main-grid">

          <div className="profile-card account-card">

            <div className="card-heading">
              <div>
                <span className="card-eyebrow">
                  Personal space
                </span>

                <h2>Account information</h2>
              </div>

              <div className="card-heading-icon">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
            </div>

            <div className="account-list">

              <div className="account-row">
                <div className="account-row-icon">
                  <FontAwesomeIcon icon={faUser} />
                </div>

                <div>
                  <span>Full name</span>
                  <strong>{user.name}</strong>
                </div>
              </div>

              <div className="account-row">
                <div className="account-row-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>

                <div>
                  <span>Email address</span>
                  <strong>{user.email}</strong>
                </div>
              </div>

              <div className="account-row">
                <div className="account-row-icon">
                  <FontAwesomeIcon icon={faShieldHalved} />
                </div>

                <div>
                  <span>Account type</span>
                  <strong>
                    {isPartner ? "Restaurant Partner" : "Foodie Member"}
                  </strong>
                </div>
              </div>

              {user.location && (
                <div className="account-row">
                  <div className="account-row-icon">
                    <FontAwesomeIcon icon={faLocationDot} />
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>{user.location}</strong>
                  </div>
                </div>
              )}

            </div>

          </div>

          <div className="profile-card side-card">

            <div className="card-heading">
              <div>
                <span className="card-eyebrow">
                  Quick access
                </span>

                <h2>Explore FoodieHub</h2>
              </div>
            </div>

            <div className="profile-actions">

              <Link to="/restaurant" className="profile-action">
                <span>
                  <FontAwesomeIcon icon={faStore} />
                </span>

                <div>
                  <strong>Explore restaurants</strong>
                  <small>Discover your next favourite</small>
                </div>

                <FontAwesomeIcon icon={faArrowRight} />
              </Link>

              <Link to="/dashboard" className="profile-action">
                <span>
                  <FontAwesomeIcon icon={faReceipt} />
                </span>

                <div>
                  <strong>
                    {isPartner ? "Partner Dashboard" : "My Orders"}
                  </strong>

                  <small>
                    {isPartner
                      ? "Manage your food business"
                      : "Track your food journey"
                    }
                  </small>
                </div>

                <FontAwesomeIcon icon={faArrowRight} />
              </Link>

              <Link to="/cart" className="profile-action">
                <span>
                  <FontAwesomeIcon icon={faBagShopping} />
                </span>

                <div>
                  <strong>My cart</strong>
                  <small>Ready for your next order?</small>
                </div>

                <FontAwesomeIcon icon={faArrowRight} />
              </Link>

            </div>

          </div>

        </section>

        {isPartner ? (

          <section className="profile-card activity-card">

            <div className="section-heading">

              <div>
                <span className="card-eyebrow">
                  Your business
                </span>

                <h2>Restaurant details</h2>

                <p>
                  Restaurants connected to your FoodieHub partner account.
                </p>
              </div>

              <Link to="/dashboard" className="section-link">
                Dashboard
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>

            </div>

            {loading ? (
              <div className="profile-loading">
                Loading your restaurants...
              </div>
            ) : partnerRestaurants.length === 0 ? (
              <div className="profile-no-data">
                <FontAwesomeIcon icon={faStore} />
                <h3>No restaurant found</h3>
                <p>
                  Your restaurant will appear here once it is connected to your account.
                </p>
              </div>
            ) : (
              <div className="restaurant-list">

                {partnerRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id || restaurant._id}
                    className="restaurant-profile-item"
                  >

                    <div className="restaurant-profile-image">
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
                      />
                    </div>

                    <div className="restaurant-profile-info">
                      <h3>{restaurant.name}</h3>

                      <p>
                        {restaurant.category || "Restaurant"}
                      </p>

                      {restaurant.address && (
                        <span>
                          <FontAwesomeIcon icon={faLocationDot} />
                          {restaurant.address}
                        </span>
                      )}
                    </div>

                    <span className="restaurant-status">
                      <FontAwesomeIcon icon={faCircleCheck} />
                      Active
                    </span>

                  </div>
                ))}

              </div>
            )}

          </section>

        ) : (

          <section className="profile-card activity-card">

            <div className="section-heading">

              <div>
                <span className="card-eyebrow">
                  Your food journey
                </span>

                <h2>Recent orders</h2>

                <p>
                  A quick look at your latest FoodieHub orders.
                </p>
              </div>

              <Link to="/dashboard" className="section-link">
                View dashboard
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>

            </div>

            {ordersLoading ? (
              <div className="profile-loading">
                Loading your order history...
              </div>
            ) : orders.length === 0 ? (
              <div className="profile-no-data">
                <FontAwesomeIcon icon={faReceipt} />
                <h3>No orders yet</h3>
                <p>
                  Your delicious journey starts with your first order.
                </p>

                <Link to="/restaurant" className="profile-primary-btn">
                  Explore restaurants
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            ) : (
              <div className="order-history">

                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="order-profile-item"
                  >

                    <div className="order-profile-icon">
                      <FontAwesomeIcon icon={faReceipt} />
                    </div>

                    <div className="order-profile-info">
                      <strong>
                        Order #{String(order.id).slice(0, 8)}
                      </strong>

                      <span>
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          }
                        )}
                      </span>
                    </div>

                    <div className="order-profile-status">
                      <span className={`status-${order.status?.replace(/\s+/g, "-")}`}>
                        {order.status}
                      </span>
                    </div>

                    <strong className="order-profile-total">
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </strong>

                  </div>
                ))}

              </div>
            )}

          </section>

        )}

        <section className="profile-member-banner">

          <div className="member-icon">
            <FontAwesomeIcon icon={faCrown} />
          </div>

          <div>
            <span>
              {isPartner ? "FOODIEHUB PARTNER" : "FOODIEHUB MEMBER"}
            </span>

            <h3>
              {isPartner
                ? "Grow your restaurant with FoodieHub."
                : "Good food. Great choices. Happy moments."
              }
            </h3>
          </div>

          <FontAwesomeIcon
            className="member-arrow"
            icon={faArrowRight}
          />

        </section>

      </div>
    </main>
  )
}

export default Profile