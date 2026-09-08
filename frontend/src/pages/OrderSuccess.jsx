import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircleCheck,
  faHouse,
  faUtensils,
  faClipboardList,
  faTruckFast,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons"

import "./OrderSuccess.css"

function OrderSuccess() {
  return (
    <main className="order-success-page">
      <div className="success-container">

        <section className="success-card">

          <div className="success-decoration success-decoration-one"></div>
          <div className="success-decoration success-decoration-two"></div>

          <div className="success-icon-wrapper">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="success-icon"
            />
          </div>

          <span className="success-eyebrow">
            Order confirmed
          </span>

          <h1>
            Your order is
            <span> on its way! 🎉</span>
          </h1>

          <p className="success-message">
            Thank you for ordering with FoodieHub. Your restaurant
            has received the order and your delicious meal is being
            prepared.
          </p>

          <div className="success-status">

            <div className="status-item active">
              <div className="status-icon">
                <FontAwesomeIcon icon={faCircleCheck} />
              </div>

              <div>
                <strong>Order placed</strong>
                <span>Successfully confirmed</span>
              </div>
            </div>

            <div className="status-line"></div>

            <div className="status-item">
              <div className="status-icon">
                <FontAwesomeIcon icon={faUtensils} />
              </div>

              <div>
                <strong>Preparing</strong>
                <span>Your food is being prepared</span>
              </div>
            </div>

            <div className="status-line"></div>

            <div className="status-item">
              <div className="status-icon">
                <FontAwesomeIcon icon={faTruckFast} />
              </div>

              <div>
                <strong>On the way</strong>
                <span>Coming to your doorstep</span>
              </div>
            </div>

          </div>

          <div className="success-actions">

            <Link to="/dashboard" className="track-order-btn">
              <FontAwesomeIcon icon={faClipboardList} />
              Track My Order
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>

            <Link to="/restaurant" className="order-more-btn">
              <FontAwesomeIcon icon={faUtensils} />
              Order More
            </Link>

            <Link to="/" className="home-link">
              <FontAwesomeIcon icon={faHouse} />
              Back to Home
            </Link>

          </div>

          <div className="success-footer">
            <span>🍴</span>
            <p>
              Great food is just a few clicks away with FoodieHub.
            </p>
          </div>

        </section>

      </div>
    </main>
  )
}

export default OrderSuccess