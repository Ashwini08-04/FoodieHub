import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faPhone,
  faLocationDot,
  faCity,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons"

import { CartContext } from "../context/CartContext"
import api from "../api/api"

import "./Checkout.css"


function Checkout() {
  const { cart, setCart } = useContext(CartContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)


  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )


  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

    setError("")
  }


  // Place Order
  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")


    // Check cart
    if (cart.length === 0) {
      setError("Your cart is empty")
      return
    }


    // Check food information
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


      // Convert cart items into Order items
      const orderItems = cart.map((item) => ({
        food: item.food,
        quantity: item.quantity,
        price: item.price
      }))


      // Order data
      const orderData = {
        items: orderItems,
        totalAmount: total,
        address: form.address,
        city: form.city,
        phone: form.phone
      }


      console.log("ORDER DATA:", orderData)


      // Send order to backend
      const response = await api.post(
        "/orders",
        orderData
      )


      console.log(
        "ORDER CREATED:",
        response.data
      )


      // Clear cart
      setCart([])


      // Go to success page
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
    <div className="checkout-page">

      {/* Heading */}
      <h1>Checkout 🛍️</h1>


      <div className="checkout-layout">

        {/* Delivery Form */}
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          <h2>Delivery Details</h2>


          {/* Name */}
          <label>
            <FontAwesomeIcon icon={faUser} />
            Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
          />


          {/* Phone */}
          <label>
            <FontAwesomeIcon icon={faPhone} />
            Phone
          </label>

          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />


          {/* Address */}
          <label>
            <FontAwesomeIcon icon={faLocationDot} />
            Address
          </label>

          <textarea
            name="address"
            placeholder="Enter your address"
            value={form.address}
            onChange={handleChange}
            required
          />


          {/* City */}
          <label>
            <FontAwesomeIcon icon={faCity} />
            City
          </label>

          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            value={form.city}
            onChange={handleChange}
            required
          />


          {/* Error */}
          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}


          {/* Place Order */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Place Order"
            }

            {!loading && (
              <FontAwesomeIcon
                icon={faArrowRight}
              />
            )}
          </button>

        </form>


        {/* Order Summary */}
        <div className="checkout-summary">

          <h2>Order Summary</h2>


          {cart.map((item, index) => (

            <div
              className="summary-item"
              key={item.food || index}
            >

              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                ₹{item.price * item.quantity}
              </strong>

            </div>

          ))}


          <hr />


          <div className="summary-total">

            <span>Total</span>

            <strong>
              ₹{total}
            </strong>

          </div>

        </div>

      </div>

    </div>
  )
}


export default Checkout