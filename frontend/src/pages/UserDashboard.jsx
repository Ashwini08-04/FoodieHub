import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faReceipt,
  faUser,
  faMapPin,
  faClock,
  faTruck,
  faStore,
  faUtensils,
  faPlus,
  faArrowRight,
  faRotate,
  faLocationDot,
  faCircleCheck,
  faPhone
} from "@fortawesome/free-solid-svg-icons"
import { io } from "socket.io-client"
import api from "../api/api"
import "./UserDashboard.css"

const SOCKET_URL = "http://localhost:5000"

const ORDER_STAGES = [
  "Placed",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered"
]

// Order helpers
const getDeliveryDetails = (order) => {
  const value = order?.deliveryAddress

  if (!value) {
    return {
      address: "",
      city: "",
      phone: ""
    }
  }

  if (typeof value === "object") {
    return {
      address: value.address || "",
      city: value.city || "",
      phone: value.phone || ""
    }
  }

  try {
    const parsed = JSON.parse(value)

    if (typeof parsed === "object") {
      return {
        address: parsed.address || "",
        city: parsed.city || "",
        phone: parsed.phone || ""
      }
    }
  } catch {}

  return {
    address: value,
    city: "",
    phone: ""
  }
}

const getItemName = (item) => {
  if (item?.name) return item.name
  if (item?.food?.name) return item.food.name
  if (typeof item?.food === "string") return "Food item"
  return "Food item"
}

const getItemPrice = (item) => {
  return Number(item?.price || item?.food?.price || 0)
}

const getItemQuantity = (item) => {
  return Number(item?.quantity || 1)
}

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null")

  const [activeTab, setActiveTab] = useState(
    user?.role === "partner" ? "Restaurants" : "Orders"
  )

  const [orders, setOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [loading, setLoading] = useState(true)

  const [myRestaurants, setMyRestaurants] = useState([])
  const [loadingRestaurants, setLoadingRestaurants] = useState(false)

  const [newDish, setNewDish] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    restaurantId: ""
  })

  // Customer orders and live tracking
  useEffect(() => {
    if (user?.role !== "partner") {
      fetchMyOrders()

      const socket = io(SOCKET_URL)

      socket.on("orderStatusUpdate", (data) => {
        setOrders((current) =>
          current.map((order) =>
            order.id === data.orderId
              ? { ...order, status: data.status }
              : order
          )
        )
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [])

  // Partner restaurants
  useEffect(() => {
    if (user?.role === "partner") {
      loadRestaurants()
    }
  }, [user])

  const fetchMyOrders = async () => {
    setLoading(true)

    try {
      const res = await api.get("/orders/my-orders")
      const orderData = Array.isArray(res.data) ? res.data : []

      setOrders(orderData)

      if (orderData.length > 0) {
        setSelectedOrderId((current) => current || orderData[0].id)
      }
    } catch (error) {
      console.error("Fetch orders failed", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const loadRestaurants = async () => {
    setLoadingRestaurants(true)

    try {
      const res = await api.get("/restaurants/owner")
      const owned = res.data || []

      setMyRestaurants(owned)

      if (owned[0]) {
        setNewDish((current) => ({
          ...current,
          restaurantId: owned[0].id
        }))
      }
    } catch (error) {
      console.error("Load restaurants failed", error)
      setMyRestaurants([])
    } finally {
      setLoadingRestaurants(false)
    }
  }

  const handleAddDish = async () => {
    if (!newDish.name || !newDish.price || !newDish.restaurantId) {
      return alert("Please fill dish name, price and select restaurant")
    }

    try {
      const payload = {
        ...newDish,
        price: parseFloat(newDish.price)
      }

      const res = await api.post("/foods", payload)

      alert(res.data.message || "Dish added successfully")

      setNewDish({
        name: "",
        price: "",
        image: "",
        category: "",
        restaurantId: myRestaurants[0]?.id || ""
      })
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add dish")
    }
  }

  const selectedOrder = useMemo(
    () =>
      orders.find((order) => order.id === selectedOrderId) ||
      orders[0] ||
      null,
    [orders, selectedOrderId]
  )

  const orderProgressIndex = (status) => {
    const normalized = String(status || "")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())

    return Math.max(0, ORDER_STAGES.indexOf(normalized))
  }

  const partnerStats = [
    {
      label: "Restaurants",
      value: myRestaurants.length,
      icon: faStore
    },
    {
      label: "Menu items",
      value: "150+",
      icon: faUtensils
    },
    {
      label: "Partner status",
      value: "Active",
      icon: faCircleCheck
    }
  ]

  if (user?.role === "partner") {
    return (
      <main className="user-dashboard-page partner-dashboard">

        <section className="partner-welcome">
          <div className="welcome-main">
            <div className="welcome-icon">
              <FontAwesomeIcon icon={faStore} />
            </div>

            <div>
              <span className="dashboard-kicker">FOODIEHUB PARTNER</span>

              <h1>
                Welcome back, {user?.name?.split(" ")[0] || "Partner"}.
              </h1>

              <p>
                Manage your restaurants, menus and food business from one place.
              </p>
            </div>
          </div>

          <div className="partner-status">
            <span className="status-dot"></span>
            Partner account active
          </div>
        </section>

        <section className="partner-stat-grid">
          {partnerStats.map((item) => (
            <div className="partner-stat-card" key={item.label}>
              <div className="stat-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>

              <div>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="partner-layout">

          <aside className="partner-sidebar">

            <div className="partner-brand">
              <div className="partner-brand-mark">F</div>

              <div>
                <strong>FoodieHub</strong>
                <span>Partner Studio</span>
              </div>
            </div>

            <div className="partner-nav-label">
              Workspace
            </div>

            <nav className="partner-nav">

              <button
                className={activeTab === "Restaurants" ? "active" : ""}
                onClick={() => setActiveTab("Restaurants")}
              >
                <FontAwesomeIcon icon={faStore} />
                <span>Restaurants</span>
                <FontAwesomeIcon
                  className="nav-arrow"
                  icon={faArrowRight}
                />
              </button>

              <button
                className={activeTab === "Menu" ? "active" : ""}
                onClick={() => setActiveTab("Menu")}
              >
                <FontAwesomeIcon icon={faUtensils} />
                <span>Menu</span>
                <FontAwesomeIcon
                  className="nav-arrow"
                  icon={faArrowRight}
                />
              </button>

              <button
                className={activeTab === "Profile" ? "active" : ""}
                onClick={() => setActiveTab("Profile")}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Profile</span>
                <FontAwesomeIcon
                  className="nav-arrow"
                  icon={faArrowRight}
                />
              </button>

            </nav>

            <div className="sidebar-tip">
              <span>Quick tip</span>
              <p>
                Keep your menu updated to give customers the best experience.
              </p>
            </div>

          </aside>

          <section className="partner-content">

            {activeTab === "Restaurants" && (
              <motion.div
                className="dashboard-section"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >

                <div className="section-heading">
                  <div>
                    <span className="dashboard-kicker">
                      YOUR BUSINESS
                    </span>

                    <h2>Your restaurants</h2>

                    <p>
                      Manage the restaurants connected to your partner account.
                    </p>
                  </div>

                  <button
                    className="small-action"
                    onClick={loadRestaurants}
                  >
                    <FontAwesomeIcon icon={faRotate} />
                    Refresh
                  </button>
                </div>

                {loadingRestaurants ? (
                  <div className="dashboard-loading">
                    <div className="loading-ring"></div>
                    <span>Loading your restaurants...</span>
                  </div>
                ) : myRestaurants.length === 0 ? (
                  <div className="partner-empty">
                    <div>
                      <FontAwesomeIcon icon={faStore} />
                    </div>

                    <h3>No restaurant yet</h3>

                    <p>
                      Create a restaurant during registration or contact the
                      FoodieHub admin team.
                    </p>
                  </div>
                ) : (
                  <div className="restaurant-business-grid">
                    {myRestaurants.map((restaurant, index) => (
                      <motion.div
                        className="business-card"
                        key={restaurant.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <div className="business-image">
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

                          <span className="open-badge">
                            <span></span>
                            Open
                          </span>
                        </div>

                        <div className="business-body">
                          <div className="business-top">
                            <div>
                              <span>{restaurant.category || "Restaurant"}</span>
                              <h3>{restaurant.name}</h3>
                            </div>

                            <div className="business-rating">
                              ★ {restaurant.rating || "4.5"}
                            </div>
                          </div>

                          <div className="business-location">
                            <FontAwesomeIcon icon={faLocationDot} />
                            {restaurant.address || "Location not added"}
                          </div>

                          <div className="business-footer">
                            <span>
                              <FontAwesomeIcon icon={faClock} />
                              {restaurant.deliveryTime || "25-35 min"}
                            </span>

                            <button
                              onClick={() => setActiveTab("Menu")}
                            >
                              Manage menu
                              <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

              </motion.div>
            )}

            {activeTab === "Menu" && (
              <motion.div
                className="dashboard-section"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >

                <div className="section-heading">
                  <div>
                    <span className="dashboard-kicker">
                      MENU MANAGEMENT
                    </span>

                    <h2>Add a new dish</h2>

                    <p>
                      Create a delicious new menu item for your restaurant.
                    </p>
                  </div>
                </div>

                {myRestaurants.length === 0 ? (
                  <div className="partner-empty">
                    <div>
                      <FontAwesomeIcon icon={faStore} />
                    </div>

                    <h3>Add a restaurant first</h3>

                    <p>
                      You need at least one restaurant before adding dishes.
                    </p>

                    <button onClick={() => setActiveTab("Restaurants")}>
                      View restaurants
                    </button>
                  </div>
                ) : (
                  <div className="menu-editor">

                    <div className="menu-editor-header">
                      <div className="editor-icon">
                        <FontAwesomeIcon icon={faPlus} />
                      </div>

                      <div>
                        <h3>Dish details</h3>
                        <p>
                          Add the basic information customers will see.
                        </p>
                      </div>
                    </div>

                    <div className="dish-form">

                      <label>
                        Restaurant

                        <select
                          value={newDish.restaurantId}
                          onChange={(event) =>
                            setNewDish((current) => ({
                              ...current,
                              restaurantId: event.target.value
                            }))
                          }
                        >
                          {myRestaurants.map((restaurant) => (
                            <option
                              key={restaurant.id}
                              value={restaurant.id}
                            >
                              {restaurant.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Dish name

                        <input
                          placeholder="e.g. Butter Chicken"
                          value={newDish.name}
                          onChange={(event) =>
                            setNewDish((current) => ({
                              ...current,
                              name: event.target.value
                            }))
                          }
                        />
                      </label>

                      <label>
                        Price

                        <input
                          type="number"
                          placeholder="₹ 299"
                          value={newDish.price}
                          onChange={(event) =>
                            setNewDish((current) => ({
                              ...current,
                              price: event.target.value
                            }))
                          }
                        />
                      </label>

                      <label>
                        Category

                        <input
                          placeholder="e.g. North Indian"
                          value={newDish.category}
                          onChange={(event) =>
                            setNewDish((current) => ({
                              ...current,
                              category: event.target.value
                            }))
                          }
                        />
                      </label>

                      <label className="full-width">
                        Image URL

                        <input
                          placeholder="/images/foods/restaurant/dish.jpg"
                          value={newDish.image}
                          onChange={(event) =>
                            setNewDish((current) => ({
                              ...current,
                              image: event.target.value
                            }))
                          }
                        />
                      </label>

                    </div>

                    <div className="form-actions">

                      <button
                        className="secondary-button"
                        onClick={() =>
                          setNewDish({
                            name: "",
                            price: "",
                            image: "",
                            category: "",
                            restaurantId: myRestaurants[0]?.id || ""
                          })
                        }
                      >
                        Clear
                      </button>

                      <button
                        className="primary-button"
                        onClick={handleAddDish}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        Add dish
                      </button>

                    </div>

                  </div>
                )}

              </motion.div>
            )}

            {activeTab === "Profile" && (
              <motion.div
                className="dashboard-section"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >

                <div className="section-heading">
                  <div>
                    <span className="dashboard-kicker">
                      PARTNER ACCOUNT
                    </span>

                    <h2>Your profile</h2>

                    <p>
                      Your FoodieHub partner account information.
                    </p>
                  </div>
                </div>

                <div className="partner-profile-card">

                  <div className="profile-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || "P"}
                  </div>

                  <div className="profile-main">
                    <span>Restaurant Partner</span>
                    <h3>{user?.name || "FoodieHub Partner"}</h3>
                    <p>{user?.email || "No email available"}</p>
                  </div>

                  <div className="profile-active">
                    <span></span>
                    Active
                  </div>

                </div>

                <div className="profile-info-grid">

                  <div className="profile-info-card">
                    <span>
                      <FontAwesomeIcon icon={faUser} />
                      Full name
                    </span>
                    <strong>{user?.name || "—"}</strong>
                  </div>

                  <div className="profile-info-card">
                    <span>
                      <FontAwesomeIcon icon={faReceipt} />
                      Account type
                    </span>
                    <strong>Restaurant Partner</strong>
                  </div>

                  <div className="profile-info-card">
                    <span>
                      <FontAwesomeIcon icon={faStore} />
                      Restaurants
                    </span>
                    <strong>{myRestaurants.length}</strong>
                  </div>

                  <div className="profile-info-card">
                    <span>
                      <FontAwesomeIcon icon={faCircleCheck} />
                      Status
                    </span>
                    <strong>Verified Partner</strong>
                  </div>

                </div>

              </motion.div>
            )}

          </section>
        </section>
      </main>
    )
  }

  return (
    <main className="user-dashboard-page">

      <section className="customer-welcome">
        <div>
          <span className="dashboard-kicker">
            FOODIEHUB ORDER CENTER
          </span>

          <h1>
            Your meals, all in one place.
          </h1>

          <p>
            Track your orders and see every step from kitchen to doorstep.
          </p>
        </div>

        <div className="customer-welcome-icon">
          <FontAwesomeIcon icon={faTruck} />
        </div>
      </section>

      <section className="customer-layout">

        <aside className="customer-sidebar">

          <div className="customer-profile-mini">
            <div>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <section>
              <strong>{user?.name || "Foodie"}</strong>
              <span>FoodieHub member</span>
            </section>
          </div>

          <nav className="customer-nav">

            <button
              className={activeTab === "Orders" ? "active" : ""}
              onClick={() => setActiveTab("Orders")}
            >
              <FontAwesomeIcon icon={faReceipt} />
              Orders
            </button>

            <button
              className={activeTab === "Profile" ? "active" : ""}
              onClick={() => setActiveTab("Profile")}
            >
              <FontAwesomeIcon icon={faUser} />
              Profile
            </button>

          </nav>

        </aside>

        <section className="customer-content">

          {activeTab === "Orders" && (
            <div className="dashboard-section">

              <div className="section-heading order-heading">
                <div>
                  <span className="dashboard-kicker">
                    ORDER HISTORY
                  </span>

                  <h2>Your recent orders</h2>

                  <p>
                    Follow your food from restaurant to doorstep.
                  </p>
                </div>

                <button
                  className="small-action"
                  onClick={fetchMyOrders}
                >
                  <FontAwesomeIcon icon={faRotate} />
                  Refresh
                </button>
              </div>

              <div className="orders-layout">

                <div className="orders-list">

                  <AnimatePresence mode="wait">

                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <motion.div
                          key={index}
                          className="order-card skeleton"
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05
                          }}
                        />
                      ))
                    ) : orders.length === 0 ? (
                      <div className="partner-empty">
                        <div>
                          <FontAwesomeIcon icon={faReceipt} />
                        </div>

                        <h3>No orders yet</h3>

                        <p>
                          Place your first order and it will appear here.
                        </p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <motion.button
                          key={order.id}
                          className={`order-card ${
                            selectedOrder?.id === order.id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedOrderId(order.id)
                          }
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >

                          <div className="order-card-icon">
                            <FontAwesomeIcon icon={faReceipt} />
                          </div>

                          <div className="order-card-main">
                            <strong>
                              Order #{order.id.substring(0, 8)}
                            </strong>

                            <small>
                              {new Date(
                                order.createdAt
                              ).toLocaleDateString()}
                            </small>
                          </div>

                          <div
                            className={`order-status-pill ${String(
                              order.status
                            )
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                          >
                            {order.status}
                          </div>

                          <strong className="order-price">
                            ₹{Number(order.totalAmount || 0).toFixed(0)}
                          </strong>

                        </motion.button>
                      ))
                    )}

                  </AnimatePresence>

                </div>

                <div className="order-detail-panel">

                  {selectedOrder ? (
                    <motion.div
                      key={selectedOrder.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                    >

                      <div className="order-detail-header">

                        <div>
                          <span className="dashboard-kicker">
                            TRACKING ORDER
                          </span>

                          <h3>
                            #{selectedOrder.id.substring(0, 8)}
                          </h3>
                        </div>

                        <div className="order-chip">
                          {selectedOrder.status}
                        </div>

                      </div>

                      <div className="progress-track">

                        {ORDER_STAGES.map((stage, index) => {
                          const completed =
                            index <=
                            orderProgressIndex(selectedOrder.status)

                          return (
                            <div
                              key={stage}
                              className="track-step"
                            >
                              <span
                                className={`track-dot ${
                                  completed ? "active" : ""
                                }`}
                              >
                                {completed ? "✓" : index + 1}
                              </span>

                              <span>{stage}</span>

                              {index <
                                ORDER_STAGES.length - 1 && (
                                <div
                                  className={`track-line ${
                                    index <
                                    orderProgressIndex(
                                      selectedOrder.status
                                    )
                                      ? "active"
                                      : ""
                                  }`}
                                />
                              )}

                            </div>
                          )
                        })}

                      </div>

                      {(() => {
                        const delivery = getDeliveryDetails(selectedOrder)

                        return (
                          <div className="order-info-grid">

                            <div>
                              <small>Delivery address</small>

                              <p>
                                <FontAwesomeIcon icon={faMapPin} />

                                {delivery.address ||
                                  "Address not available"}

                                {delivery.city && (
                                  <span>
                                    , {delivery.city}
                                  </span>
                                )}
                              </p>
                            </div>

                            <div>
                              <small>Contact</small>

                              <p>
                                <FontAwesomeIcon icon={faPhone} />

                                {delivery.phone ||
                                  "Phone not available"}
                              </p>
                            </div>

                            <div>
                              <small>Order total</small>

                              <p>
                                ₹
                                {Number(
                                  selectedOrder.totalAmount || 0
                                ).toFixed(0)}
                                <span> • Card</span>
                              </p>
                            </div>

                            <div>
                              <small>Order placed</small>

                              <p>
                                <FontAwesomeIcon icon={faClock} />

                                {new Date(
                                  selectedOrder.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>

                          </div>
                        )
                      })()}

                      <div className="order-items">

                        <span className="dashboard-kicker">
                          ITEMS IN THIS ORDER
                        </span>

                        {Array.isArray(selectedOrder.items) &&
                        selectedOrder.items.length > 0 ? (
                          selectedOrder.items.map((item, index) => {
                            const name = getItemName(item)
                            const price = getItemPrice(item)
                            const quantity = getItemQuantity(item)

                            return (
                              <div
                                key={
                                  item.food?._id ||
                                  item.food?.id ||
                                  item.food ||
                                  index
                                }
                                className="order-item-row"
                              >
                                <div>

                                  <strong>
                                    {name}
                                  </strong>

                                  <small>
                                    {quantity} × ₹
                                    {price.toFixed(0)}
                                  </small>

                                </div>

                                <span>
                                  ₹
                                  {(quantity * price).toFixed(0)}
                                </span>

                              </div>
                            )
                          })
                        ) : (
                          <p>No items found for this order.</p>
                        )}

                      </div>

                    </motion.div>
                  ) : (
                    <div className="partner-empty">
                      <div>
                        <FontAwesomeIcon icon={faReceipt} />
                      </div>

                      <h3>Select an order</h3>

                      <p>
                        Choose an order from the list to view its tracking
                        details.
                      </p>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {activeTab === "Profile" && (
            <div className="dashboard-section">

              <div className="section-heading">
                <div>
                  <span className="dashboard-kicker">
                    YOUR ACCOUNT
                  </span>

                  <h2>Profile</h2>

                  <p>
                    Your FoodieHub account information.
                  </p>
                </div>
              </div>

              <div className="partner-profile-card">

                <div className="profile-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="profile-main">
                  <span>FoodieHub member</span>
                  <h3>{user?.name || "Foodie"}</h3>
                  <p>{user?.email || "No email available"}</p>
                </div>

                <div className="profile-active">
                  <span></span>
                  Active
                </div>

              </div>

            </div>
          )}

        </section>
      </section>
    </main>
  )
}

export default UserDashboard