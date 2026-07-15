import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import { registerUser } from "../services/authServices.JS";

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

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => {
      return {
        ...currentForm,
        [name]: value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const data = await registerUser(form);
      console.log(data);
      setMessage("Account created successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to create account.");
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="page-eyebrow"></p>
        <h1>Register</h1>

        <div className="auth-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            onChange={handleChange}
            required
            type="text"
            value={form.name}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={form.email}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={form.password}
            minLength={8}
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
              required
            />
          </div>
        </div>

        <button type="submit">Create Account</button>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-switch">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}
