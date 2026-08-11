import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircleCheck,
  faHouse,
  faUtensils
} from "@fortawesome/free-solid-svg-icons"
import "./OrderSuccess.css"

function OrderSuccess() {
  return (
    <div className="order-success">

      {/* Success message */}
      <FontAwesomeIcon
        icon={faCircleCheck}
        className="success-icon"
      />

      <h1>Order Placed Successfully! 🎉</h1>

      <p>
        Thank you for your order. Your food is being prepared.
      </p>

      <div className="success-buttons">
        <Link to="/">
          <FontAwesomeIcon icon={faHouse} />
          Back to Home
        </Link>

        <Link to="/restaurant">
          <FontAwesomeIcon icon={faUtensils} />
          Order More
        </Link>
      </div>

    </div>
  )
}

export default OrderSuccess
