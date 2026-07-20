import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { loginUser } from "../services/authServices.js";

const emptyForm = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from
    ? location.state.from.pathname + (location.state.from.search || "")
    : "/dashboard";

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const loginData = {
        email: form.email.trim(),
        password: form.password,
      };

      const data = await loginUser(loginData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setForm(emptyForm);

      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message || "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="page-eyebrow">Welcome back</p>

        <h1>Log In</h1>

        <div className="auth-field">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-switch">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>

        <p className="auth-switch">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  );
}
