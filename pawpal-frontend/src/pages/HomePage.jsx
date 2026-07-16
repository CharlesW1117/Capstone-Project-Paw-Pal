import { Link } from "react-router-dom";
import dogImage from "../assets/Dog.png";
import "./HomePage.css";

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-welcome">Welcome to PawPal!</p>
          <h1>
            Happy pets.
            <br />
            Peace of mind.
          </h1>
          <p className="hero-text">
            Find trusted pet sitters and dog walkers in your neighborhood.
          </p>
          <div
            //add routing to Links
            className="hero-actions"
          >
            <Link className="hero-button primary-button" to="/">
              Find a sitter
            </Link>

            <Link className="hero-button secondary-button" to="/register">
              Become a sitter
            </Link>
          </div>
        </div>
        <div className="hero-image-card">
          <div
            //add image
            className="pet-image-holder"
          >
            <img src={dogImage} alt="dog"></img>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <article className="step-card">
            <span className="step-icon i">
              <i class="fi fi-rs-search"></i>
            </span>
            <h3>1. Search</h3>
            <p>Find pet sitters or walkers near you.</p>
          </article>

          <article className="step-card">
            <span className="step-icon i">
              <i className="fi fi-rr-calendar-clock"></i>
            </span>
            <h3>2. Book</h3>
            <p>Choose a service and book with ease.</p>
          </article>

          <article className="step-card">
            <span className="step-icon i">
              <i className="fi fi-rr-briefcase"></i>
            </span>
            <h3>3. Relax</h3>
            <p>Your pet is in good hands.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
