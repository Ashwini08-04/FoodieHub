import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faPhone,
  faLocationDot,
  faCity,
  faArrowRight,
  faShieldHalved,
  faTruckFast,
  faBagShopping,
  faCheck,
  faTag
} from "@fortawesome/free-solid-svg-icons"

import { CartContext } from "../context/CartContext"
import api from "../api/api"

import "./Checkout.css"

function Checkout() {
  const {
    cart,
    setCart,
    cartSubtotal,
    totalDiscount,
    totalAmount,
    appliedOffers
  } = useContext(CartContext)

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const itemCount = cart.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  )

  const uniqueOffers = [
    ...new Set(
      (appliedOffers || [])
        .map((offer) => offer.offer)
        .filter(Boolean)
    )
  ]

  // Handle form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

    setError("")
  }

  // Place order
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (cart.length === 0) {
      setError("Your cart is empty")
      return
    }

    const invalidItem = cart.find(
      (item) => !item.food
    )

    if (invalidItem) {
      setError(
        "Food information is missing. Please go back and add the food again."
      )
      return
    }

    try {
      setLoading(true)

      const orderItems = cart.map((item) => ({
        food: item.food,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        restaurantId:
          item.restaurantId ||
          item.restaurant?.id ||
          item.restaurant?._id ||
          null,
        restaurantName:
          item.restaurantName ||
          item.restaurant?.name ||
          "",
        offer: item.offer || ""
      }))

      const orderData = {
        items: orderItems,
        subtotal: cartSubtotal,
        discount: totalDiscount,
        totalAmount,
        address: form.address,
        city: form.city,
        phone: form.phone
      }

      const response =
        await api.post(
          "/orders",
          orderData
        )

      console.log(
        "ORDER CREATED:",
        response.data
      )

      setCart([])

      navigate("/order-success")
    } catch (error) {
      console.error(
        "Order creation failed:",
        error.response?.data || error
      )

      setError(
        error.response?.data?.message ||
        "Failed to place order"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">

        <section className="checkout-heading">

          <div>
            <span className="checkout-eyebrow">
              <FontAwesomeIcon
                icon={faBagShopping}
              />
              Almost there
            </span>

            <h1>
              Complete your order
            </h1>

            <p>
              Add your delivery details and get
              your favourite food delivered fresh
              to your door.
            </p>
          </div>

          <div className="checkout-progress">

            <div className="progress-step active">
              <span>
                <FontAwesomeIcon
                  icon={faCheck}
                />
              </span>

              <small>
                Cart
              </small>
            </div>

            <div className="progress-line active"></div>

            <div className="progress-step active">
              <span>
                2
              </span>

              <small>
                Checkout
              </small>
            </div>

            <div className="progress-line"></div>

            <div className="progress-step">
              <span>
                3
              </span>

              <small>
                Done
              </small>
            </div>

          </div>

        </section>

        <div className="checkout-layout">

          <section className="checkout-left">

            <form
              className="checkout-form"
              onSubmit={handleSubmit}
            >

              <div className="form-header">

                <div className="form-header-icon">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                  />
                </div>

                <div>
                  <span>
                    Delivery information
                  </span>

                  <h2>
                    Where should we deliver?
                  </h2>

                  <p>
                    Enter your details so we can
                    bring your order right to your
                    doorstep.
                  </p>
                </div>

              </div>

              <div className="form-grid">

                <div className="input-group">

                  <label htmlFor="name">
                    <FontAwesomeIcon
                      icon={faUser}
                    />
                    Full name
                  </label>

                  <div className="input-wrapper">
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>

                <div className="input-group">

                  <label htmlFor="phone">
                    <FontAwesomeIcon
                      icon={faPhone}
                    />
                    Phone number
                  </label>

                  <div className="input-wrapper">
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>

                <div className="input-group full-width">

                  <label htmlFor="address">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                    />
                    Delivery address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    placeholder="House no., building, street, landmark..."
                    value={form.address}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="input-group full-width">

                  <label htmlFor="city">
                    <FontAwesomeIcon
                      icon={faCity}
                    />
                    City
                  </label>

                  <div className="input-wrapper">
                    <input
                      id="city"
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>

              </div>

              {error && (
                <div className="checkout-error">
                  {error}
                </div>
              )}

              <div className="checkout-benefits">

                <div>
                  <FontAwesomeIcon
                    icon={faShieldHalved}
                  />

                  <span>
                    <strong>
                      Secure checkout
                    </strong>

                    <small>
                      Your information is protected
                    </small>
                  </span>
                </div>

                <div>
                  <FontAwesomeIcon
                    icon={faTruckFast}
                  />

                  <span>
                    <strong>
                      Fast delivery
                    </strong>

                    <small>
                      Fresh food delivered to you
                    </small>
                  </span>
                </div>

              </div>

              <button
                className="place-order-btn"
                type="submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="checkout-spinner"></span>
                    Placing your order...
                  </>
                ) : (
                  <>
                    Place order

                    <FontAwesomeIcon
                      icon={faArrowRight}
                    />
                  </>
                )}

              </button>

              <p className="checkout-note">
                By placing your order, you confirm
                that the delivery details provided
                above are correct.
              </p>

            </form>

          </section>

          <aside className="checkout-summary">

            <div className="summary-top">

              <div>
                <span>
                  Order review
                </span>

                <h2>
                  Your order
                </h2>
              </div>

              <div className="summary-count">
                {itemCount}
              </div>

            </div>

            <div className="summary-items">

              {cart.map((item, index) => {

                const imageUrl =
                  item.image?.startsWith("http")
                    ? item.image
                    : item.image
                      ? item.image.startsWith("/")
                        ? item.image
                        : `/${item.image}`
                      : "/images/cheese-pizza.jpg"

                const itemTotal =
                  Number(item.price || 0) *
                  Number(item.quantity || 0)

                return (
                  <div
                    className="summary-item"
                    key={`${item.food || item.id || item.name}-${index}`}
                  >

                    <div className="summary-item-image">

                      <img
                        src={imageUrl}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src =
                            "/images/cheese-pizza.jpg"
                        }}
                      />

                      <span>
                        {item.quantity}
                      </span>

                    </div>

                    <div className="summary-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.category || "Food"}
                      </p>

                    </div>

                    <strong>
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </strong>

                  </div>
                )
              })}

            </div>

            <div className="summary-divider"></div>

            <div className="summary-details">

              <div>
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹{cartSubtotal.toLocaleString("en-IN")}
                </strong>
              </div>

              {totalDiscount > 0 && (
                <div className="discount-row">

                  <span>
                    <FontAwesomeIcon
                      icon={faTag}
                    />
                    Offer discount
                  </span>

                  <strong>
                    -₹{totalDiscount.toLocaleString("en-IN")}
                  </strong>

                </div>
              )}

              <div>

                <span>
                  Delivery fee
                </span>

                <strong className="free">
                  FREE
                </strong>

              </div>

            </div>

            {uniqueOffers.length > 0 && (
              <div className="applied-offer-box">

                <FontAwesomeIcon
                  icon={faTag}
                />

                <div>

                  <strong>
                    Offer applied
                  </strong>

                  <p>
                    {uniqueOffers.join(" • ")}
                  </p>

                </div>

              </div>
            )}

            <div className="summary-divider"></div>

            <div className="checkout-total">

              <div>

                <span>
                  Total payable
                </span>

                <small>
                  You save ₹
                  {totalDiscount.toLocaleString("en-IN")}
                </small>

              </div>

              <strong>
                ₹{totalAmount.toLocaleString("en-IN")}
              </strong>

            </div>

            <div className="summary-security">

              <FontAwesomeIcon
                icon={faShieldHalved}
              />

              <div>

                <strong>
                  Safe & secure
                </strong>

                <p>
                  Your order details are securely
                  processed.
                </p>

              </div>

            </div>

            <button
              className="back-cart-btn"
              type="button"
              onClick={() =>
                navigate("/cart")
              }
            >
              ← Back to cart
            </button>

          </aside>

        </div>

      </div>
    </main>
  )
}

export default Checkout