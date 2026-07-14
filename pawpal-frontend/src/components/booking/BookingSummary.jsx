import { Link } from "react-router-dom";
import "./BookingSummary.css";

function formatDate(value) {
  if (!value) {
    return "Not selected";
  }

  const datePart = String(value).slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return datePart;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatTime(value) {
  if (!value) {
    return "";
  }

  const [hours, minutes] = String(value).split(":").map(Number);
  const date = new Date(2000, 0, 1, hours, minutes);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatPrice(value) {
  const numericPrice = Number(value);

  if (!Number.isFinite(numericPrice)) {
    return "Not selected";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericPrice);
}

function BookingSummary({
  sitter,
  service,
  availability,
  pets,
  selectedPetId,
  onPetChange,
  onSubmit,
  isLoadingPets,
  petsError,
  onRetryPets,
  isSubmitting,
  bookingError,
}) {
  const canSubmit =
    sitter &&
    service &&
    availability &&
    selectedPetId &&
    !isLoadingPets &&
    !isSubmitting;

  return (
    <div className="booking-summary">
      <header className="booking-summary__header">
        <div>
          <p>Booking request</p>
          <h2>Review your selection</h2>
        </div>

        <i className="fi fi-rr-calendar-check" aria-hidden="true" />
      </header>

      <dl className="booking-summary__details">
        <div>
          <dt>Sitter</dt>
          <dd>{sitter?.name || "Not selected"}</dd>
        </div>

        <div>
          <dt>Service</dt>
          <dd>
            {service
              ? `${service.name} - ${formatPrice(service.price)}`
              : "Choose a service above"}
          </dd>
        </div>

        <div>
          <dt>Date</dt>
          <dd>
            {availability
              ? formatDate(availability.date)
              : "Choose an available time"}
          </dd>
        </div>

        <div>
          <dt>Time</dt>
          <dd>
            {availability
              ? `${formatTime(
                  availability.startTime,
                )} - ${formatTime(availability.endTime)}`
              : "Not selected"}
          </dd>
        </div>
      </dl>

      <div className="booking-summary__pet-field">
        <label htmlFor="booking-pet">Pet</label>

        {isLoadingPets ? (
          <div className="booking-summary__pet-loading" role="status">
            <span
              className="booking-summary__spinner"
              aria-hidden="true"
            />
            Loading your pets...
          </div>
        ) : petsError ? (
          <div className="booking-summary__pet-error" role="alert">
            <p>{petsError}</p>

            <button type="button" onClick={onRetryPets}>
              Try again
            </button>
          </div>
        ) : pets.length === 0 ? (
          <div className="booking-summary__no-pets">
            <p>You need a pet profile before requesting a booking.</p>
            <Link to="/pets">Add a pet profile</Link>
          </div>
        ) : (
          <select
            id="booking-pet"
            value={selectedPetId}
            onChange={(event) => onPetChange(event.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Choose a pet</option>

            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name} ({pet.species})
              </option>
            ))}
          </select>
        )}
      </div>

      {bookingError && (
        <div className="booking-summary__error" role="alert">
          <i
            className="fi fi-rr-triangle-warning"
            aria-hidden="true"
          />
          <span>{bookingError}</span>
        </div>
      )}

      <button
        className="booking-summary__submit"
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
      >
        {isSubmitting && (
          <span
            className="booking-summary__spinner booking-summary__spinner--light"
            aria-hidden="true"
          />
        )}

        {isSubmitting ? "Submitting..." : "Request booking"}
      </button>

      <p className="booking-summary__notice">
        Your request will remain pending until the sitter accepts it.
      </p>
    </div>
  );
}

export default BookingSummary;