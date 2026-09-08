import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlus,
  faMinus,
  faTrash,
  faArrowRight,
  faBagShopping,
  faShieldHalved,
  faTruckFast,
  faTag
} from "@fortawesome/free-solid-svg-icons"

import { CartContext } from "../context/CartContext"
import "./Cart.css"

function Cart() {
  const { cart, setCart } = useContext(CartContext)
  const navigate = useNavigate()

  const increase = (index) => {
    const updatedCart = [...cart]
    updatedCart[index].quantity++
    setCart(updatedCart)
  }

  const decrease = (index) => {
    const updatedCart = [...cart]

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity--
      setCart(updatedCart)
    }
  }

  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  )

  const itemCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  )

  return (
    <main className="cart-page">

      <div className="cart-container">

        <section className="cart-header">

          <div>
            <span className="cart-eyebrow">
              <FontAwesomeIcon icon={faBagShopping} />
              Your selection
            </span>

            <h1>Your Cart</h1>

            <p>
              {cart.length > 0
                ? `${itemCount} delicious ${itemCount === 1 ? "item" : "items"} ready to order.`
                : "Your cart is waiting for something delicious."
              }
            </p>
          </div>

          {cart.length > 0 && (
            <div className="cart-count-badge">
              <strong>{itemCount}</strong>
              <span>Items</span>
            </div>
          )}

        </section>

        {cart.length === 0 ? (

          <section className="empty-cart">

            <div className="empty-cart-icon">
              <FontAwesomeIcon icon={faBagShopping} />
            </div>

            <span className="empty-cart-label">
              Nothing here yet
            </span>

            <h2>Your cart is feeling lonely</h2>

            <p>
              Discover amazing restaurants and add your favourite
              dishes to make your next meal special.
            </p>

            <button
              className="browse-btn"
              onClick={() => navigate("/restaurant")}
            >
              Explore restaurants
              <FontAwesomeIcon icon={faArrowRight} />
            </button>

          </section>

        ) : (

          <div className="cart-layout">

            <section className="cart-items-section">

              <div className="cart-section-heading">
                <div>
                  <span>Your order</span>
                  <h2>Selected dishes</h2>
                </div>

                <span className="items-label">
                  {cart.length} {cart.length === 1 ? "dish" : "dishes"}
                </span>
              </div>

              <div className="cart-items">

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
                    <article
                      className="cart-item"
                      key={`${item.food || item.id || item.name}-${index}`}
                    >

                      <div className="cart-food-image">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          onError={(event) => {
                            event.currentTarget.onerror = null
                            event.currentTarget.src =
                              "/images/cheese-pizza.jpg"
                          }}
                        />
                      </div>

                      <div className="cart-food-info">

                        <span className="cart-food-category">
                          {item.category || "Food"}
                        </span>

                        <h3>{item.name}</h3>

                        <p>
                          ₹{Number(item.price || 0).toLocaleString("en-IN")} per item
                        </p>

                        <strong className="mobile-item-total">
                          ₹{itemTotal.toLocaleString("en-IN")}
                        </strong>

                      </div>

                      <div className="quantity-control">

                        <button
                          type="button"
                          onClick={() => decrease(index)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => increase(index)}
                          aria-label="Increase quantity"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>

                      </div>

                      <strong className="cart-item-total">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </strong>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeItem(index)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>

                    </article>
                  )
                })}

              </div>

              <button
                className="continue-shopping"
                onClick={() => navigate("/restaurant")}
              >
                <span>←</span>
                Continue exploring food
              </button>

            </section>

            <aside className="order-summary">

              <div className="summary-heading">
                <div>
                  <span>Checkout</span>
                  <h2>Order Summary</h2>
                </div>

                <FontAwesomeIcon icon={faBagShopping} />
              </div>

              <div className="summary-rows">

                <div>
                  <span>Subtotal</span>
                  <strong>
                    ₹{total.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>Delivery fee</span>
                  <strong className="free-text">
                    FREE
                  </strong>
                </div>

                <div>
                  <span>
                    <FontAwesomeIcon icon={faTag} />
                    Savings
                  </span>
                  <strong className="saving-text">
                    ₹0
                  </strong>
                </div>

              </div>

              <div className="summary-divider"></div>

              <div className="grand-total">

                <div>
                  <span>Total payable</span>
                  <small>Inclusive of all charges</small>
                </div>

                <strong>
                  ₹{total.toLocaleString("en-IN")}
                </strong>

              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <FontAwesomeIcon icon={faArrowRight} />
              </button>

              <div className="secure-checkout">

                <FontAwesomeIcon icon={faShieldHalved} />

                <div>
                  <strong>Safe & secure checkout</strong>
                  <span>Your payment details are protected.</span>
                </div>

              </div>

              <div className="delivery-note">
                <FontAwesomeIcon icon={faTruckFast} />

                <span>
                  Fast delivery from your favourite restaurants
                </span>
              </div>

            </aside>

          </div>
        )}

      </div>
    </main>
  )
}

export default Cart