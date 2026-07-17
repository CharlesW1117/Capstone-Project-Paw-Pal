import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSitters } from "../services/sitterService";

function Sitters() {
  const [sitters, setSitters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function loadSitters() {
    setIsLoading(true);
    setLoadError("");

    try {
      const sitterResults = await getSitters();
      setSitters(sitterResults);
    } catch (requestError) {
      setLoadError(requestError.message || "Unable to load sitters.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSitters();
  }, []);

  if (isLoading) {
    return <p style={{ padding: "2rem" }}>Loading sitters...</p>;
  }

  if (loadError) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "crimson" }}>{loadError}</p>
        <button
          onClick={loadSitters}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#4B2E83",
            color: "white",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ color: "#4B2E83" }}>Find a Sitter 🐾</h1>
      <p style={{ color: "#555" }}>
        Browse trusted sitters in your area. Ready to book?{" "}
        <Link to="/register" style={{ color: "#4B2E83", fontWeight: "bold" }}>
          Create an account
        </Link>{" "}
        to get started.
      </p>

      {sitters.length === 0 && (
        <p style={{ marginTop: "2rem" }}>
          No sitters available yet — check back soon! 🐶
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        {sitters.map((sitter) => (
          <div
            key={sitter.id}
            style={{
              border: "1px solid #e0d7f3",
              borderRadius: "12px",
              padding: "1rem",
              background: "white",
            }}
          >
            <h2 style={{ margin: "0 0 0.5rem", color: "#4B2E83" }}>
              {sitter.name}
            </h2>

            {sitter.city && (
              <p style={{ margin: "0.25rem 0", color: "#555" }}>
                📍 {sitter.city}
                {sitter.state ? `, ${sitter.state}` : ""}
              </p>
            )}

            {sitter.reviewCount > 0 ? (
              <p style={{ margin: "0.25rem 0" }}>
                ⭐ {Number(sitter.averageRating).toFixed(1)} (
                {sitter.reviewCount}{" "}
                {sitter.reviewCount === 1 ? "review" : "reviews"})
              </p>
            ) : (
              <p style={{ margin: "0.25rem 0", color: "#888" }}>
                No reviews yet
              </p>
            )}

            {sitter.bio && (
              <p style={{ margin: "0.5rem 0", fontStyle: "italic" }}>
                {sitter.bio}
              </p>
            )}

            {sitter.services && sitter.services.length > 0 && (
              <div
                style={{
                  margin: "0.75rem 0",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid #eee",
                }}
              >
                {sitter.services.map((service) => (
                  <p
                    key={service.sitterServiceId}
                    style={{
                      margin: "0.25rem 0",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{service.name}</span>
                    <span style={{ fontWeight: "bold", color: "#4B2E83" }}>
                      ${service.price}
                    </span>
                  </p>
                ))}
              </div>
            )}

            <Link
              to="/login"
              style={{
                display: "inline-block",
                marginTop: "0.5rem",
                padding: "8px 16px",
                borderRadius: "6px",
                background: "#4B2E83",
                color: "white",
                textDecoration: "none",
              }}
            >
              Log in to book
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Sitters;
