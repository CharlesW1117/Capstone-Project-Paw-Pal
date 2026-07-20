import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import { requestPasswordReset } from "../services/authServices.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devResetLink, setDevResetLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setDevResetLink("");
    setIsSubmitting(true);

    try {
      const data = await requestPasswordReset(email.trim());

      setMessage(
        data.message ||
          "If an account exists for that email, a password reset link has been sent.",
      );

      if (data.resetLink) {
        setDevResetLink(data.resetLink);
      }
    } catch (error) {
      setMessage(error.message || "Unable to process this request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="page-eyebrow">Reset your password</p>

        <h1>Forgot Password</h1>

        <div className="auth-field">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>

        {message && <p className="auth-message">{message}</p>}

        {devResetLink && (
          <p className="auth-message">
            Dev mode (no email service configured):{" "}
            <Link to={devResetLink.replace(/^.*\/reset-password/, "/reset-password")}>
              Open reset link
            </Link>
          </p>
        )}

        <p className="auth-switch">
          Remembered your password? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}
