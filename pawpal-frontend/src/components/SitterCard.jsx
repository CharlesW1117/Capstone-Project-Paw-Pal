import AvailabilityPicker from "./AvailabilityPicker";
import "./SitterCard.css";

function getInitials(name) {
  if (!name) {
    return "PS";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericPrice);
}

function SitterCard({
  sitter,
  isAvailabilityOpen,
  availability,
  isAvailabilityLoading,
  availabilityError,
  selectedAvailabilityId,
  onToggleAvailability,
  onSelectAvailability,
  onRetryAvailability,
}) {
  const averageRating = Number(sitter.averageRating || 0).toFixed(1);
  const services = Array.isArray(sitter.services)
    ? sitter.services
    : [];

  const availabilitySectionId = `sitter-${sitter.id}-availability`;

  return (
    <article className="sitter-card">
      <header className="sitter-card__header">
        <div className="sitter-card__avatar" aria-hidden="true">
          {getInitials(sitter.name)}
        </div>

        <div className="sitter-card__identity">
          <h2>{sitter.name}</h2>
          <p>
            <i className="fi fi-rr-marker" aria-hidden="true" />
            {[sitter.city, sitter.state].filter(Boolean).join(", ")}
          </p>
        </div>
      </header>

      <div className="sitter-card__metrics">
        <div>
          <span className="sitter-card__metric-label">Rating</span>
          <strong>
            <i className="fi fi-rr-star" aria-hidden="true" />
            {averageRating}
          </strong>
          <small>
            {sitter.reviewCount || 0}{" "}
            {Number(sitter.reviewCount) === 1 ? "review" : "reviews"}
          </small>
        </div>

        <div>
          <span className="sitter-card__metric-label">Trust Score</span>
          <strong>{sitter.trustScore || 0}</strong>
          <small>out of 100</small>
        </div>
      </div>

      <p className="sitter-card__bio">
        {sitter.bio || "This sitter has not added a biography yet."}
      </p>

      <div className="sitter-card__services">
        <h3>Services</h3>

        {services.length > 0 ? (
          <ul>
            {services.map((service) => (
              <li key={service.sitterServiceId}>
                <div>
                  <strong>{service.name}</strong>

                  {service.description && (
                    <span>{service.description}</span>
                  )}
                </div>

                <b>{formatPrice(service.price)}</b>
              </li>
            ))}
          </ul>
        ) : (
          <p>No services are currently listed.</p>
        )}
      </div>

      <button
        className="sitter-card__availability-toggle"
        type="button"
        onClick={() => onToggleAvailability(sitter)}
        aria-expanded={isAvailabilityOpen}
        aria-controls={availabilitySectionId}
      >
        <i className="fi fi-rr-calendar-clock" aria-hidden="true" />
        {isAvailabilityOpen ? "Hide availability" : "View availability"}
        <i
          className={`fi ${
            isAvailabilityOpen
              ? "fi-rr-angle-small-up"
              : "fi-rr-angle-small-down"
          }`}
          aria-hidden="true"
        />
      </button>

      {isAvailabilityOpen && (
        <div id={availabilitySectionId}>
          <AvailabilityPicker
            sitterName={sitter.name}
            availability={availability}
            isLoading={isAvailabilityLoading}
            error={availabilityError}
            selectedAvailabilityId={selectedAvailabilityId}
            onSelect={(slot) => onSelectAvailability(sitter, slot)}
            onRetry={() => onRetryAvailability(sitter.id)}
          />
        </div>
      )}
    </article>
  );
}

export default SitterCard;