import { useMemo, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowTrendUp,
  faBars,
  faBell,
  faChartLine,
  faCheck,
  faChevronRight,
  faCircle,
  faCirclePlus,
  faClock,
  faGear,
  faIndianRupeeSign,
  faLeaf,
  faPencil,
  faReceipt,
  faStore,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { demoFoods, demoOrders } from "../data/demoData"
import "./Dashboard.css"

const initialMenu = demoFoods["burger-point"].map((food) => ({ ...food, isAvailable: true }))

function Dashboard() {
  const [activeView, setActiveView] = useState("Overview")
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("foodiehub-partner-menu")
    return saved ? JSON.parse(saved) : initialMenu
  })
  const [orders, setOrders] = useState(demoOrders)
  const [showMenuForm, setShowMenuForm] = useState(false)
  const [editingFood, setEditingFood] = useState(null)
  const [notice, setNotice] = useState("")

  const revenue = useMemo(() => orders.reduce((total, order) => total + order.amount, 0), [orders])
  const saveMenu = (nextMenu) => {
    setMenu(nextMenu)
    localStorage.setItem("foodiehub-partner-menu", JSON.stringify(nextMenu))
  }

  const updateOrder = (id, status) => {
    setOrders((currentOrders) => currentOrders.map((order) => order.id === id ? { ...order, status } : order))
    setNotice(`Order ${id} moved to ${status.toLowerCase()}.`)
    window.setTimeout(() => setNotice(""), 2500)
  }

  const deleteFood = (id) => {
    saveMenu(menu.filter((food) => food.id !== id))
    setNotice("Menu item removed.")
    window.setTimeout(() => setNotice(""), 2500)
  }

  const toggleAvailability = (id) => {
    saveMenu(menu.map((food) => food.id === id ? { ...food, isAvailable: !food.isAvailable } : food))
  }

  const navItems = [
    { label: "Overview", icon: faChartLine },
    { label: "Menu", icon: faLeaf },
    { label: "Orders", icon: faReceipt },
    { label: "Settings", icon: faGear },
  ]

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand"><span><FontAwesomeIcon icon={faStore} /></span><div>Foodie<span>Hub</span><small>PARTNER</small></div></div>
        <div className="partner-profile"><div className="partner-avatar">BP</div><div><strong>Burger Point</strong><small>Partner account</small></div><FontAwesomeIcon icon={faChevronRight} /></div>
        <nav className="dashboard-nav">
          <p>MANAGE YOUR OUTLET</p>
          {navItems.map((item) => <button key={item.label} className={activeView === item.label ? "active" : ""} onClick={() => setActiveView(item.label)}><FontAwesomeIcon icon={item.icon} />{item.label}{item.label === "Orders" && <b>2</b>}</button>)}
        </nav>
        <div className="sidebar-help"><div className="help-icon"><FontAwesomeIcon icon={faBell} /></div><strong>Need a hand?</strong><p>Our partner support team is here for you.</p><button>Get support <FontAwesomeIcon icon={faArrowTrendUp} /></button></div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div className="mobile-dash-logo"><FontAwesomeIcon icon={faStore} /> FoodieHub</div>
          <div><span className="eyebrow">Monday, 12 August 2026</span><h1>{activeView === "Overview" ? "Good morning, Burger Point" : activeView}</h1></div>
          <div className="dashboard-header-actions"><span className="outlet-status"><FontAwesomeIcon icon={faCircle} /> Open now</span><button className="notification-button"><FontAwesomeIcon icon={faBell} /><i /></button><div className="header-avatar">BP</div></div>
        </header>

        {notice && <div className="dashboard-notice"><FontAwesomeIcon icon={faCheck} /> {notice}</div>}

        {activeView === "Overview" && <Overview revenue={revenue} orders={orders} setActiveView={setActiveView} updateOrder={updateOrder} />}
        {activeView === "Menu" && <MenuView menu={menu} setShowMenuForm={setShowMenuForm} setEditingFood={setEditingFood} deleteFood={deleteFood} toggleAvailability={toggleAvailability} />}
        {activeView === "Orders" && <OrdersView orders={orders} updateOrder={updateOrder} />}
        {activeView === "Settings" && <SettingsView />}
      </section>

      {showMenuForm && <MenuForm food={editingFood} close={() => { setShowMenuForm(false); setEditingFood(null) }} save={(food) => { saveMenu(editingFood ? menu.map((item) => item.id === food.id ? food : item) : [...menu, { ...food, _id: `food-${Date.now()}` }]); setShowMenuForm(false); setEditingFood(null); setNotice(editingFood ? "Menu item updated." : "New menu item added."); window.setTimeout(() => setNotice(""), 2500) }} />}
    </main>
  )
}

function Overview({ revenue, orders, setActiveView, updateOrder }) {
  return (
    <div className="dashboard-view">
      <section className="welcome-strip"><div><span className="eyebrow light-eyebrow">Your outlet at a glance</span><h2>Let&apos;s make today delicious.</h2><p>Here&apos;s how your restaurant is performing today.</p></div><div className="welcome-illustration">🍔</div></section>
      <div className="metric-grid">
        <Metric label="Today&apos;s revenue" value={`₹${revenue.toLocaleString("en-IN")}`} change="+18.4%" icon={faIndianRupeeSign} />
        <Metric label="Orders today" value="34" change="+12.8%" icon={faReceipt} />
        <Metric label="Avg. order value" value="₹486" change="+6.2%" icon={faArrowTrendUp} />
        <Metric label="Your rating" value="4.6" change="Top 10%" icon={faLeaf} />
      </div>
      <div className="dashboard-columns">
        <section className="dashboard-card orders-card"><div className="card-heading"><div><span className="eyebrow">Live activity</span><h2>Recent orders</h2></div><button className="card-link" onClick={() => setActiveView("Orders")}>View all <FontAwesomeIcon icon={faChevronRight} /></button></div><div className="order-table">{orders.slice(0, 3).map((order) => <OrderRow order={order} key={order.id} updateOrder={updateOrder} />)}</div></section>
        <section className="dashboard-card performance-card"><div className="card-heading"><div><span className="eyebrow">This week</span><h2>Performance</h2></div><button className="more-button"><FontAwesomeIcon icon={faBars} /></button></div><div className="chart-value">₹18,420 <span><FontAwesomeIcon icon={faArrowTrendUp} /> 18.4%</span></div><div className="mini-chart"><div className="chart-grid-lines"><i /><i /><i /></div><svg viewBox="0 0 320 110" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f86b3c" stopOpacity=".28" /><stop offset="100%" stopColor="#f86b3c" stopOpacity="0" /></linearGradient></defs><path d="M0 95 C 20 90, 24 66, 46 75 S 75 85, 91 57 S 120 63, 136 64 S 166 22, 180 43 S 215 40, 230 51 S 265 7, 282 25 S 306 20, 320 8 V110 H0Z" fill="url(#chartFill)" /><path d="M0 95 C 20 90, 24 66, 46 75 S 75 85, 91 57 S 120 63, 136 64 S 166 22, 180 43 S 215 40, 230 51 S 265 7, 282 25 S 306 20, 320 8" fill="none" stroke="#f86b3c" strokeWidth="3" /></svg></div><div className="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></section>
      </div>
    </div>
  )
}

function Metric({ label, value, change, icon }) {
  return <div className="metric-card"><div className="metric-icon"><FontAwesomeIcon icon={icon} /></div><span>{label}</span><strong>{value}</strong><small><FontAwesomeIcon icon={faArrowTrendUp} /> {change} <em>vs last week</em></small></div>
}

function OrderRow({ order, updateOrder }) {
  return <div className="order-row"><div className="order-id"><strong>{order.id}</strong><small>{order.time}</small></div><div className="order-customer"><strong>{order.customer}</strong><small>{order.items}</small></div><strong className="order-amount">₹{order.amount}</strong><select className={`status-select ${order.status.toLowerCase().replaceAll(" ", "-")}`} value={order.status} onChange={(event) => updateOrder(order.id, event.target.value)}><option>Preparing</option><option>Out for delivery</option><option>Delivered</option></select></div>
}

function MenuView({ menu, setShowMenuForm, setEditingFood, deleteFood, toggleAvailability }) {
  return <div className="dashboard-view"><div className="view-title-row"><div><span className="eyebrow">Your offerings</span><h2>Menu management</h2><p>Keep your menu fresh and up to date for hungry customers.</p></div><button className="primary-button" onClick={() => { setEditingFood(null); setShowMenuForm(true) }}><FontAwesomeIcon icon={faCirclePlus} /> Add item</button></div><div className="menu-management-card"><div className="menu-card-top"><strong>{menu.length} items</strong><span><FontAwesomeIcon icon={faCircle} /> Live on FoodieHub</span></div><div className="menu-management-list">{menu.map((food) => <div className="management-item" key={food.id}><img src={food.image} alt="" /><div className="management-info"><strong>{food.name}</strong><small>{food.category} · ₹{food.price}</small><p>{food.description}</p></div><button className={`availability ${food.isAvailable ? "available" : "unavailable"}`} onClick={() => toggleAvailability(food.id)}><FontAwesomeIcon icon={faCircle} /> {food.isAvailable ? "Available" : "Paused"}</button><button className="icon-button" onClick={() => { setEditingFood(food); setShowMenuForm(true) }}><FontAwesomeIcon icon={faPencil} /></button><button className="icon-button danger" onClick={() => deleteFood(food.id)}><FontAwesomeIcon icon={faTrash} /></button></div>)}</div></div></div>
}

function OrdersView({ orders, updateOrder }) {
  return <div className="dashboard-view"><div className="view-title-row"><div><span className="eyebrow">Stay on top of service</span><h2>All orders</h2><p>Review and update every order from one place.</p></div><div className="order-filter"><FontAwesomeIcon icon={faClock} /> Today <FontAwesomeIcon icon={faChevronRight} /></div></div><div className="dashboard-card full-orders-card"><div className="order-table">{orders.map((order) => <OrderRow order={order} key={order.id} updateOrder={updateOrder} />)}</div></div></div>
}

function SettingsView() {
  return <div className="dashboard-view"><div className="view-title-row"><div><span className="eyebrow">Your restaurant</span><h2>Settings</h2><p>Manage your outlet details and service preferences.</p></div></div><div className="settings-card"><label>Restaurant name<input defaultValue="Burger Point" /></label><label>Contact number<input defaultValue="+91 98765 43210" /></label><label>Address<textarea defaultValue="12th Main Road, Indiranagar, Bengaluru" /></label><label>Average preparation time<select defaultValue="20–25 min"><option>15–20 min</option><option>20–25 min</option><option>30–35 min</option></select></label><button className="primary-button">Save changes <FontAwesomeIcon icon={faCheck} /></button></div></div>
}

function MenuForm({ food, close, save }) {
  const [form, setForm] = useState(food || { name: "", category: "Burgers", description: "", price: 0, image: "/images/classic-burger.jpg", isAvailable: true })
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.name === "price" ? Number(event.target.value) : event.target.value })
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}><form className="menu-modal" onSubmit={(event) => { event.preventDefault(); save(form) }}><button type="button" className="modal-close" onClick={close}><FontAwesomeIcon icon={faXmark} /></button><span className="eyebrow">Menu editor</span><h2>{food ? "Edit menu item" : "Add a new item"}</h2><label>Item name<input name="name" value={form.name} onChange={update} placeholder="e.g. Spicy chicken burger" required /></label><div className="form-two-col"><label>Category<select name="category" value={form.category} onChange={update}><option>Burgers</option><option>Sides</option><option>Beverages</option><option>Desserts</option></select></label><label>Price<input name="price" type="number" min="1" value={form.price} onChange={update} required /></label></div><label>Description<textarea name="description" value={form.description} onChange={update} placeholder="Tell customers what makes it special" /></label><label>Image path<input name="image" value={form.image} onChange={update} /></label><button className="primary-button" type="submit"><FontAwesomeIcon icon={faCheck} /> Save item</button></form></div>
}

export default Dashboard
