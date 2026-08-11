import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlus,
  faMinus,
  faTrash,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons"
import { CartContext } from "../context/CartContext"
import "./Cart.css"

function Cart() {
  const { cart, setCart } = useContext(CartContext)
  const navigate = useNavigate()

  const increase = index => {
    const updatedCart = [...cart]
    updatedCart[index].quantity++
    setCart(updatedCart)
  }

  const decrease = index => {
    const updatedCart = [...cart]

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity--
      setCart(updatedCart)
    }
  }

  const removeItem = index => {
    setCart(cart.filter((_, i) => i !== index))
  }

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="cart">

      {/* Cart heading */}
      <h1>Your Cart 🛒</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some delicious food to continue.</p>

          <button onClick={() => navigate("/restaurant")}>
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="cart-layout">

          {/* Cart items */}
          <div className="cart-items">

            {cart.map((item, index) => (
              <div className="cart-item" key={index}>

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                  <strong>₹{item.price}</strong>
                </div>

                <div className="quantity">
                  <button onClick={() => decrease(index)}>
                    <FontAwesomeIcon icon={faMinus} />
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increase(index)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(index)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>

              </div>
            ))}

          </div>

          {/* Order summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div>
              <span>Subtotal</span>
              <strong>₹{total}</strong>
            </div>

            <div>
              <span>Delivery</span>
              <strong>Free</strong>
            </div>

            <hr />

            <div className="grand-total">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

        </div>
      )}

    </div>
  )
}

export default Cart
