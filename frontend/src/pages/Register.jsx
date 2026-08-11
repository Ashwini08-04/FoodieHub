import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    location: "",
    // partner-specific
    restaurantName: "",
    restaurantAddress: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        location: form.location
      };

      if (form.role === "partner") {
        if (!form.restaurantName || !form.restaurantAddress) {
          setError("Please enter your restaurant name and address")
          setLoading(false)
          return
        }

        payload.restaurant = {
          name: form.restaurantName,
          address: form.restaurantAddress || form.location,
          category: "Uncategorized"
        };
      }

      const response = await api.post("/auth/register", payload);

      // Auto-login
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("isLoggedIn", "true");

      alert(response.data.message || "Registered");

      navigate(response.data.user.role === 'partner' ? "/dashboard" : "/");
    } catch (error) {
      console.error("Register failed", error);
      setError(
        error.response?.data?.message || error.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register-card">
        <h1>Create Account 🍔</h1>

        <p>Sign up as a customer or restaurant partner.</p>

        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="field-row">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="role-picker">
            <label>
              <input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={handleChange} />
              Customer
            </label>
            <label>
              <input type="radio" name="role" value="partner" checked={form.role === 'partner'} onChange={handleChange} />
              Restaurant Partner
            </label>
          </div>

          <input
            type="text"
            name="location"
            placeholder="City or location"
            value={form.location}
            onChange={handleChange}
          />

          {form.role === 'partner' && (
            <div className="partner-section">
              <h3>Partner details</h3>
              <input type="text" name="restaurantName" placeholder="Restaurant name" value={form.restaurantName} onChange={handleChange} />
              <input type="text" name="restaurantAddress" placeholder="Restaurant address" value={form.restaurantAddress} onChange={handleChange} />
              <p className="small-note">We'll ask for menu images and category details after signup is complete.</p>
            </div>
          )}

          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? {" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
