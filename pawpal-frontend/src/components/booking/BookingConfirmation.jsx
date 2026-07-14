import { Link } from "react-router-dom";
import "./BookingConfirmation.css";

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
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
    year: "numeric",
  }).format(date);
}

function formatTime(value) {
  if (!value) {
    return "Time unavailable";
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
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericPrice);
}

function formatStatus(value) {
  if (!value) {
    return "Pending";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function BookingConfirmation({
  booking,
  pet,
  sitter,
  service,
  availability,
  onClose,
}) {
  const bookingDate = booking?.date || availability?.date;
  const startTime = booking?.startTime || availability?.startTime;
  const endTime = booking?.endTime || availability?.endTime;
  const totalPrice = booking?.totalPrice ?? service?.price;

  return (
    <div className="booking-confirmation">
      <div className="booking-confirmation__success">
        <div className="booking-confirmation__icon" aria-hidden="true">
          <i className="fi fi-rr-check-circle" />
        </div>

        <div>
          <h3>Your booking request was sent</h3>
          <p>
            {sitter.name} will need to accept the request before it is
            confirmed.
          </p>
        </div>
      </div>

      <dl className="booking-confirmation__details">
        <div>
          <dt>Pet</dt>
          <dd>{pet?.name || "Pet unavailable"}</dd>
        </div>

        <div>
          <dt>Sitter</dt>
          <dd>{sitter.name}</dd>
        </div>

        <div>
          <dt>Service</dt>
          <dd>{service.name}</dd>
        </div>

        <div>
          <dt>Price</dt>
          <dd>{formatPrice(totalPrice)}</dd>
        </div>

        <div>
          <dt>Date</dt>
          <dd>{formatDate(bookingDate)}</dd>
        </div>

        <div>
          <dt>Time</dt>
          <dd>
            {formatTime(startTime)} - {formatTime(endTime)}
          </dd>
        </div>

        <div>
          <dt>Status</dt>
          <dd>
            <span className="booking-confirmation__status">
              {formatStatus(booking?.status)}
            </span>
          </dd>
        </div>

        <div>
          <dt>Booking ID</dt>
          <dd>#{booking?.id || "Unavailable"}</dd>
        </div>
      </dl>

      <div className="booking-confirmation__notice">
        <i className="fi fi-rr-info" aria-hidden="true" />
        <p>
          You can track this request and any status changes from your
          calendar.
        </p>
      </div>

      <div className="booking-confirmation__actions">
        <button
          className="booking-confirmation__button booking-confirmation__button--secondary"
          type="button"
          onClick={onClose}
        >
          Book another service
        </button>

        <Link
          className="booking-confirmation__button booking-confirmation__button--primary"
          to="/calendar"
          onClick={onClose}
        >
          <i className="fi fi-rr-calendar" aria-hidden="true" />
          View calendar
        </Link>
      </div>
    </div>
  );
}

export default BookingConfirmation;