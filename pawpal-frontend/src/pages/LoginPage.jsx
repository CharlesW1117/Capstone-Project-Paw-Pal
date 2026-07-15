import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const emptyForm = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => {
      return {
        ...currentForm,
        [name]: value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("pawPalUser"));

    if (!savedUser) {
      setMessage("No account exists yet. Please register first.");
      return;
    }

    const emailMatches = savedUser.email === form.email;
    const passwordMatches = savedUser.password === form.password;

    if (!emailMatches || !passwordMatches) {
      setMessage("Email or password does not match.");
      return;
    }

    localStorage.setItem("pawPalLoggedIn", "true");
    localStorage.setItem("pawPalCurrentUser", JSON.stringify(savedUser));

    setMessage(`Welcome back, ${savedUser.name}!`);
    setForm(emptyForm);

    if (savedUser.role === "sitter") {
      navigate("/sitter-dashboard");
    } else {
      navigate("/owner-dashboard");
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
            required
          />
        </div>

        <button type="submit">Log In</button>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-switch">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  );
}
