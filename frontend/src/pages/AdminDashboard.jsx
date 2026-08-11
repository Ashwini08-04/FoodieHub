import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faStore, faPlus } from "@fortawesome/free-solid-svg-icons";
import api from "../api/api";
import "./Dashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Orders");
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchRestaurants();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin/all");
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await api.get("/restaurants");
      setRestaurants(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span><FontAwesomeIcon icon={faStore} /></span>
          <div>Foodie<span>Hub</span><small>ADMIN</small></div>
        </div>
        <nav className="dashboard-nav">
          <button className={activeTab === "Orders" ? "active" : ""} onClick={() => setActiveTab("Orders")}>
            <FontAwesomeIcon icon={faReceipt} /> Orders
          </button>
          <button className={activeTab === "Restaurants" ? "active" : ""} onClick={() => setActiveTab("Restaurants")}>
            <FontAwesomeIcon icon={faStore} /> Restaurants
          </button>
        </nav>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Admin {activeTab}</h1>
          </div>
        </header>

        {activeTab === "Orders" && (
          <div className="dashboard-view">
            <h2>All Orders</h2>
            <div className="order-table">
              {orders.map(order => (
                <div key={order.id} className="order-row">
                  <div className="order-id">
                    <strong>{order.id.substring(0, 8)}</strong>
                    <small>{new Date(order.createdAt).toLocaleTimeString()}</small>
                  </div>
                  <div className="order-customer">
                    <strong>{order.user?.name || "Unknown"}</strong>
                    <small>{order.items.length} items</small>
                  </div>
                  <strong className="order-amount">₹{order.totalAmount}</strong>
                  <select
                    className={`status-select ${order.status?.toLowerCase().replaceAll(" ", "-") || 'placed'}`}
                    value={order.status || "placed"}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="placed">Placed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out for delivery">Out for delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Restaurants" && (
          <div className="dashboard-view">
            <div className="view-title-row">
              <h2>Restaurants</h2>
              <button className="primary-button"><FontAwesomeIcon icon={faPlus} /> Add</button>
            </div>
            <div className="menu-management-list">
              {restaurants.map(rest => (
                <div key={rest.id} className="management-item">
                  <img src={rest.image} alt={rest.name} />
                  <div className="management-info">
                    <strong>{rest.name}</strong>
                    <p>{rest.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
