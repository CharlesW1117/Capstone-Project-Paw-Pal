import "./RatingSummary.css";

function clampNumber(value, minimum, maximum) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return minimum;
  }

  return Math.min(Math.max(numericValue, minimum), maximum);
}

function formatBackgroundStatus(value) {
  const labels = {
    verified: "Verified",
    pending: "Pending",
    rejected: "Not verified",
    not_submitted: "Not submitted",
  };

  return labels[value] || "Not available";
}

function RatingSummary({ sitter }) {
  const averageRating = clampNumber(sitter.averageRating, 0, 5);
  const trustScore = clampNumber(sitter.trustScore, 0, 100);
  const onTimePercentage = clampNumber(
    sitter.onTimePercentage,
    0,
    100,
  );

  return (
    <section
      className="rating-summary"
      aria-labelledby="rating-summary-heading"
    >
      <div className="rating-summary__rating">
        <p className="rating-summary__label">Average rating</p>

        <div className="rating-summary__rating-value">
          <strong>{averageRating.toFixed(1)}</strong>
          <span>out of 5</span>
        </div>

        <div
          className="rating-summary__stars"
          aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <i
              key={index}
              className={
                index < Math.round(averageRating)
                  ? "fi fi-sr-star"
                  : "fi fi-rr-star"
              }
              aria-hidden="true"
            />
          ))}
        </div>

        <p className="rating-summary__review-count">
          {sitter.reviewCount || 0}{" "}
          {Number(sitter.reviewCount) === 1 ? "review" : "reviews"}
        </p>
      </div>

      <div className="rating-summary__metrics">
        <h2 id="rating-summary-heading">Trust and reliability</h2>

        <div className="rating-summary__metric">
          <div className="rating-summary__metric-heading">
            <span>Trust Score</span>
            <strong>{trustScore}/100</strong>
          </div>

          <div
            className="rating-summary__progress"
            role="progressbar"
            aria-label="Trust Score"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={trustScore}
          >
            <span style={{ width: `${trustScore}%` }} />
          </div>
        </div>

        <div className="rating-summary__metric">
          <div className="rating-summary__metric-heading">
            <span>On-time percentage</span>
            <strong>{onTimePercentage}%</strong>
          </div>

          <div
            className="rating-summary__progress rating-summary__progress--on-time"
            role="progressbar"
            aria-label="On-time percentage"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={onTimePercentage}
          >
            <span style={{ width: `${onTimePercentage}%` }} />
          </div>
        </div>

        <div className="rating-summary__verification">
          <i
            className={
              sitter.backgroundCheckStatus === "verified"
                ? "fi fi-rr-badge-check"
                : "fi fi-rr-shield-exclamation"
            }
            aria-hidden="true"
          />

          <div>
            <span>Background check</span>
            <strong>
              {formatBackgroundStatus(sitter.backgroundCheckStatus)}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RatingSummary;