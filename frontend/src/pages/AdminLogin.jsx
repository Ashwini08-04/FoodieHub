import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import "./Auth.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/admin/login", {
        email: form.email,
        password: form.password,
      });

      // Save JWT Token
      localStorage.setItem("token", response.data.token);

      // Save User Details
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Login Status
      localStorage.setItem("isLoggedIn", "true");

      alert(response.data.message);

      navigate("/admin");
    } catch (error) {
      setError(
        error.response?.data?.message || "Admin Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth admin-auth">
      <h1>Admin Login 👑</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Authenticating..." : "Login to Dashboard"}
        </button>
      </form>

      <p className="auth-link">
        Not an admin?{" "}
        <Link to="/login">
          User Login
        </Link>
      </p>
    </div>
  );
}

export default AdminLogin;
