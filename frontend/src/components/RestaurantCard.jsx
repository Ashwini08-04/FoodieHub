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
  const imageUrl = image?.startsWith("http")
    ? image
    : image
      ? image.startsWith("/")
        ? image
        : `/${image}`
      : "/images/pizza-house.jpg"

  return (
    <div className="restaurant-card">

      {/* Offer badge */}
      {offer && (
        <span className="offer-badge">
          <FontAwesomeIcon icon={faFire} />
          {offer}
        </span>
      )}

      {/* Restaurant image */}
      <div className="restaurant-image">
        <img
          src={imageUrl}
          alt={`${name} restaurant`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = "/images/pizza-house.jpg"
          }}
        />
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