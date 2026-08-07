import { useContext } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faStar,
  faClock,
  faCartShopping
} from "@fortawesome/free-solid-svg-icons"

import { CartContext } from "../context/CartContext"
import "./FoodCard.css"

function FoodCard({ id, name, category, price, image }) {
  const { cart, setCart } = useContext(CartContext)

  const addToCart = () => {
    const existingItem = cart.find(item => item.food === id)

    if (existingItem) {
      setCart(
        cart.map(item =>
          item.food === id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          food: id,
          name,
          category,
          price,
          image,
          quantity: 1
        }
      ])
    }
  }

  return (
    <div className="food-card">

      {/* Food image */}
      <div className="food-image">
        <img src={image} alt={name} />
      </div>

      {/* Food information */}
      <div className="food-info">

        <div className="food-title">
          <h3>{name}</h3>

          <span>
            <FontAwesomeIcon icon={faStar} />
            4.5
          </span>
        </div>

        <p>{category}</p>

        <small>
          <FontAwesomeIcon icon={faClock} />
          20-30 min
        </small>

        <div className="food-bottom">

          <strong>₹{price}</strong>

          <button onClick={addToCart}>
            <FontAwesomeIcon icon={faCartShopping} />
            Add
          </button>

        </div>

      </div>

    </div>
  )
}

export default FoodCard