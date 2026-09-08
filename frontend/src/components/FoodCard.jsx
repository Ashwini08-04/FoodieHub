import { useContext } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faStar,
  faClock,
  faCartShopping,
  faLeaf
} from "@fortawesome/free-solid-svg-icons"

import { CartContext } from "../context/CartContext"
import "./FoodCard.css"

function FoodCard({
  id,
  name,
  category,
  description,
  price,
  image,
  rating = 4.5,
  bestseller,
  restaurantId,
  restaurantName,
  offer
}) {
  const { addItem } = useContext(CartContext)

  const addToCart = () => {
    addItem({
      food: id,
      name,
      category,
      price,
      image,
      restaurantId,
      restaurantName,
      offer
    })
  }

  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : image.startsWith("/")
        ? image
        : `/${image}`
    : "/images/cheese-pizza.jpg"

  return (
    <div className="food-card">

      {bestseller && (
        <span className="food-bestseller">
          Bestseller
        </span>
      )}

      <div className="food-image">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src =
              "/images/cheese-pizza.jpg"
          }}
        />
      </div>

      {/* Food information */}
      <div className="food-info">

        <div className="food-title">
          <h3>{name}</h3>

          <span>
            <FontAwesomeIcon icon={faStar} />
            {rating}
          </span>
        </div>

        <p className="food-category">
          <FontAwesomeIcon icon={faLeaf} />
          {category}
        </p>

        {description && (
          <p className="food-description">
            {description}
          </p>
        )}

        <small>
          <FontAwesomeIcon icon={faClock} />
          20-30 min
        </small>

        <div className="food-bottom">

          <strong>
            ₹{Number(price).toLocaleString("en-IN")}
          </strong>

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