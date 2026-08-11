import { useEffect, useState } from "react"
import api from "../api/api"
import "./Profile.css"

function Profile() {
  const [user, setUser] = useState(() => {
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
    if (isPartner) {
      setLoading(true)
      api.get("/restaurants/owner")
        .then((res) => setPartnerRestaurants(res.data || []))
        .catch(() => setPartnerRestaurants([]))
        .finally(() => setLoading(false))
    }
  }, [isPartner])

  useEffect(() => {
    if (!isPartner) {
      setOrdersLoading(true)
      api.get("/orders/my-orders")
        .then((res) => setOrders(res.data || []))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false))
    }
  }, [isPartner])

  if (!user) {
    return (
      <div className="profile-page">
        <h1>Profile</h1>
        <p>Please login or register to view your profile.</p>
      </div>
    )
  }

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>{user.role === "partner" ? "Manage your restaurant details and menu from here." : "View your account details and order history."}</p>
        </div>
      </section>

      <section className="profile-details">
        <div className="profile-card">
          <h2>Account information</h2>
          <div>
            <strong>Name</strong>
            <p>{user.name}</p>
          </div>
          <div>
            <strong>Email</strong>
            <p>{user.email}</p>
          </div>
          <div>
            <strong>Role</strong>
            <p>{user.role}</p>
          </div>
          {user.location && (
            <div>
              <strong>Location</strong>
              <p>{user.location}</p>
            </div>
          )}
        </div>

        {isPartner ? (
          <div className="profile-card">
            <h2>Restaurant details</h2>
            {loading ? (
              <p>Loading your restaurants…</p>
            ) : partnerRestaurants.length === 0 ? (
              <p>No restaurant was found for your account yet.</p>
            ) : (
              partnerRestaurants.map((restaurant) => (
                <div key={restaurant.id || restaurant._id} className="restaurant-summary">
                  <strong>{restaurant.name}</strong>
                  <p>{restaurant.address}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="profile-card">
            <h2>Your orders</h2>
            {ordersLoading ? (
              <p>Loading your order history…</p>
            ) : orders.length === 0 ? (
              <p>You have no past orders yet. Start ordering to track your deliveries here.</p>
            ) : (
              <div className="order-history">
                {orders.map((order) => (
                  <div key={order.id} className="order-summary">
                    <strong>Order #{String(order.id).slice(0, 8)}</strong>
                    <p>Status: {order.status}</p>
                    <p>Total: ₹{order.totalAmount}</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default Profile
