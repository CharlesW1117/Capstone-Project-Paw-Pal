import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/auth.css";
import { resetPassword } from "../services/authServices.js";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, password);
      setIsComplete(true);
      setMessage("Password has been reset. You can now log in.");
    } catch (error) {
      setMessage(error.message || "Unable to reset your password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <section className="auth-page">
        <div className="auth-form">
          <p className="page-eyebrow">Reset your password</p>
          <h1>Invalid Link</h1>
          <p className="auth-message">
            This password reset link is missing a token. Request a new one
            below.
          </p>
          <p className="auth-switch">
            <Link to="/forgot-password">Request a new reset link</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="page-eyebrow">Reset your password</p>

        <h1>Choose a New Password</h1>

        <div className="auth-field">
          <label htmlFor="password">New password</label>

          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword">Confirm new password</label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting || isComplete}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>

        {message && <p className="auth-message">{message}</p>}

        {isComplete ? (
          <p className="auth-switch">
            <Link to="/login">Go to login</Link>
          </p>
        ) : (
          <p className="auth-switch">
            Remembered your password? <Link to="/login">Log in</Link>
          </p>
        )}
      </form>
    </section>
  );
}
