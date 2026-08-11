import "./Footer.css"

function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-grid">
        <div className="footer-brand">
          <strong>FoodieHub</strong>
          <p>Delicious meals delivered fast and fresh.</p>
        </div>

        <div>
          <h3>Company</h3>
          <a href="/">About</a>
          <a href="/restaurant">Restaurants</a>
          <a href="/dashboard">Dashboard</a>
        </div>

        <div>
          <h3>Legal</h3>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
        </div>

        <div>
          <h3>Subscribe</h3>
          <p>Get exclusive offers and new restaurant launches.</p>
          <div className="footer-subscribe">
            <input type="email" placeholder="Your email" aria-label="Email" />
            <button>Join</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 FoodieHub. Built for tasty deliveries.</span>
        <div className="footer-badges">
          <span>App Store</span>
          <span>Google Play</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
