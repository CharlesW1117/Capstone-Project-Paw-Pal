import { getBookingStatusLabel } from "../../utils/calendarEvents";
import "./CalendarEventDetails.css";

function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatPrice(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericValue);
}

function CalendarEventDetails({ event, sitterName }) {
  const resource = event.resource || {};

  if (resource.type === "availability") {
    return (
      <div className="calendar-event-details">
        <span className="calendar-event-details__status calendar-event-details__status--available">
          Available
        </span>

        <dl className="calendar-event-details__list">
          <div>
            <dt>Sitter</dt>
            <dd>{sitterName || "Selected sitter"}</dd>
          </div>

          <div>
            <dt>Date</dt>
            <dd>{formatDate(event.start)}</dd>
          </div>

          <div>
            <dt>Time</dt>
            <dd>
              {formatTime(event.start)} - {formatTime(event.end)}
            </dd>
          </div>
        </dl>

        <p className="calendar-event-details__notice">
          This time is currently open for booking.
        </p>
      </div>
    );
  }

  const booking = resource.booking || {};
  const status = resource.status || "pending";

  return (
    <div className="calendar-event-details">
      <span
        className={`calendar-event-details__status calendar-event-details__status--${status}`}
      >
        {getBookingStatusLabel(status)}
      </span>

      <dl className="calendar-event-details__list">
        <div>
          <dt>Service</dt>
          <dd>{booking.serviceName || "Pet care service"}</dd>
        </div>

        <div>
          <dt>Pet</dt>
          <dd>{booking.petName || "Not available"}</dd>
        </div>

        <div>
          <dt>Sitter</dt>
          <dd>{booking.sitterName || "Not available"}</dd>
        </div>

        <div>
          <dt>Owner</dt>
          <dd>{booking.ownerName || "Not available"}</dd>
        </div>

        <div>
          <dt>Date</dt>
          <dd>{formatDate(event.start)}</dd>
        </div>

        <div>
          <dt>Time</dt>
          <dd>
            {formatTime(event.start)} - {formatTime(event.end)}
          </dd>
        </div>

        <div>
          <dt>Total</dt>
          <dd>{formatPrice(booking.totalPrice)}</dd>
        </div>

        <div>
          <dt>Booking ID</dt>
          <dd>#{booking.id}</dd>
        </div>
      </dl>
    </div>
  );
}

export default CalendarEventDetails;