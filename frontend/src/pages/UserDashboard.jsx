import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faReceipt, faUser, faMapPin, faClock, faTruck, faShieldCheck } from "@fortawesome/free-solid-svg-icons"
import { io } from "socket.io-client"
import api from "../api/api"
import "./UserDashboard.css"

const SOCKET_URL = "http://localhost:5000"
const ORDER_STAGES = ["Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered"]

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("Orders")
  const [orders, setOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyOrders()

    const socket = io(SOCKET_URL)
    socket.on("orderStatusUpdate", (data) => {
      setOrders((current) =>
        current.map((order) =>
          order.id === data.orderId ? { ...order, status: data.status } : order
        )
      )
    })

    return () => socket.disconnect()
  }, [])

  const fetchMyOrders = async () => {
    setLoading(true)
    try {
      const res = await api.get("/orders/my-orders")
      setOrders(res.data || [])
    } catch (error) {
      console.error("Fetch orders failed", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) || orders[0] || null,
    [orders, selectedOrderId]
  )

  const orderProgressIndex = (status) => Math.max(0, ORDER_STAGES.indexOf(status))

  return (
    <main className="user-dashboard-page">
      <section className="dashboard-hero">
        <div className="hero-copy">
          <span className="eyebrow">Live order tracking</span>
          <h1>See every meal move from kitchen to doorstep.</h1>
          <p>Track the progress of your orders with clear status stages and real-time updates.</p>
        </div>
        <div className="hero-card">
          <div className="hero-card-header">
            <span>Next delivery</span>
            <strong>{orders[0]?.status || "No active order"}</strong>
          </div>
          <div className="hero-card-meta">
            <div><FontAwesomeIcon icon={faMapPin} /><span>{orders[0]?.address || "Set your delivery address"}</span></div>
            <div><FontAwesomeIcon icon={faClock} /><span>{orders[0]?.createdAt ? new Date(orders[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}</span></div>
          </div>
        </div>
      </section>

      <section className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">
            <div className="brand-icon">FH</div>
            <div>
              <strong>FoodieHub</strong>
              <small>Order center</small>
            </div>
          </div>
          <nav className="dashboard-nav">
            <button className={activeTab === "Orders" ? "active" : ""} onClick={() => setActiveTab("Orders")}>Orders</button>
            <button className={activeTab === "Profile" ? "active" : ""} onClick={() => setActiveTab("Profile")}>Profile</button>
          </nav>
        </aside>

        <section className="dashboard-content">
          {activeTab === "Orders" && (
            <>
              <div className="orders-summary">
                <div>
                  <span className="eyebrow">Order history</span>
                  <h2>Your recent orders</h2>
                </div>
                <button className="refresh-button" onClick={fetchMyOrders}>Refresh</button>
              </div>

              <div className="orders-layout">
                <div className="orders-list">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <motion.div key={index} className="order-card skeleton" initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }} />
                      ))
                    ) : orders.length === 0 ? (
                      <div className="empty-state">
                        <p>No orders yet. Place a meal and track it here.</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <motion.button
                          key={order.id}
                          className={`order-card ${selectedOrder?.id === order.id ? "selected" : ""}`}
                          onClick={() => setSelectedOrderId(order.id)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div>
                            <strong>Order #{order.id.substring(0, 8)}</strong>
                            <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                          </div>
                          <div className="order-status-pill {order.status.toLowerCase()}">{order.status}</div>
                          <span>₹{order.totalAmount}</span>
                        </motion.button>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                <div className="order-detail-panel">
                  {selectedOrder ? (
                    <motion.div key={selectedOrder.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
                      <div className="order-detail-header">
                        <div>
                          <span className="eyebrow">Tracking order</span>
                          <h3>Order #{selectedOrder.id.substring(0, 8)}</h3>
                        </div>
                        <div className="order-chip">{selectedOrder.status}</div>
                      </div>

                      <div className="progress-track">
                        {ORDER_STAGES.map((stage, index) => {
                          const completed = index <= orderProgressIndex(selectedOrder.status)
                          return (
                            <div key={stage} className="track-step">
                              <span className={`track-dot ${completed ? "active" : ""}`}>{completed ? "" : index + 1}</span>
                              <span>{stage}</span>
                              {index < ORDER_STAGES.length - 1 && <div className={`track-line ${completed ? "active" : ""}`} />}
                            </div>
                          )
                        })}
                      </div>

                      <div className="order-info-grid">
                        <div>
                          <small>Delivery address</small>
                          <p>{selectedOrder.address || "Set delivery address in checkout"}</p>
                        </div>
                        <div>
                          <small>Payment</small>
                          <p>₹{selectedOrder.totalAmount} • Card</p>
                        </div>
                      </div>

                      <div className="order-items">
                        <span className="eyebrow">Items in this order</span>
                        {selectedOrder.items.map((item) => (
                          <div key={item.food?._id || item.food?._id || item.food} className="order-item-row">
                            <div>
                              <strong>{item.food?.name || "Item"}</strong>
                              <small>{item.quantity} × ₹{item.price}</small>
                            </div>
                            <span>₹{item.quantity * item.price}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="empty-state">
                      <p>Select an order to view progress details.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "Profile" && (
            <div className="profile-panel">
              <span className="eyebrow">Your profile</span>
              <h2>Account information</h2>
              <p>Manage your profile data and delivery preferences.</p>
              <div className="profile-blocks">
                <div className="profile-block">
                  <h3>Delivery address</h3>
                  <p>123 Food Street, Food City</p>
                </div>
                <div className="profile-block">
                  <h3>Contact</h3>
                  <p>+91 98765 43210</p>
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
