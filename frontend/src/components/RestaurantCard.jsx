import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faStar,
  faClock,
  faLocationDot,
  faFire
} from "@fortawesome/free-solid-svg-icons"
import "./RestaurantCard.css"

function RestaurantCard({
  name,
  category,
  image,
  rating,
  deliveryTime,
  distance,
  offer
}) {
  return (
    <div className="restaurant-card">

      {/* Offer badge */}
      <span className="offer-badge">
        <FontAwesomeIcon icon={faFire} />
        {offer}
      </span>

      {/* Restaurant image */}
      <div className="restaurant-image">
        <img src={image} alt={name} />
      </div>

      <div className="restaurant-info">

        <div className="restaurant-title">
          <h3>{name}</h3>

          <span className="rating">
            <FontAwesomeIcon icon={faStar} />
            {rating}
          </span>
        </div>

        <p>{category}</p>

        <div className="restaurant-details">
          <span>
            <FontAwesomeIcon icon={faClock} />
            {deliveryTime}
          </span>

          <span>
            <FontAwesomeIcon icon={faLocationDot} />
            {distance}
          </span>
        </div>

      </div>

    </div>
  )
}

export default RestaurantCard