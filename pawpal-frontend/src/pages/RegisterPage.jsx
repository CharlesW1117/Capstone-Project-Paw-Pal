import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { registerUser } from "../services/authServices.js";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "",
  city: "",
  state: "",
  zipCode: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

    const registrationData = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
      zipCode: form.zipCode.trim(),
    };

    try {
      const data = await registerUser(registrationData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setForm(emptyForm);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="page-eyebrow">Join PawPal</p>
        <h1>Register</h1>

        <div className="auth-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
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
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="role">I want to...</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Select a role</option>
            <option value="owner">Find a pet sitter</option>
            <option value="sitter">Become a pet sitter</option>
          </select>
        </div>

        <div className="auth-location-row">
          <div className="auth-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              autoComplete="address-level2"
              maxLength={100}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              name="state"
              type="text"
              value={form.state}
              onChange={handleChange}
              autoComplete="address-level1"
              maxLength={2}
              placeholder="IL"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="zipCode">ZIP Code</label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              value={form.zipCode}
              onChange={handleChange}
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={10}
              required
            />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>

        {message && (
          <p className="auth-message" role="alert">
            {message}
          </p>
        )}

        <p className="auth-switch">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}