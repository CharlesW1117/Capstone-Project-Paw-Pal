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

function CalendarEventDetails({
  event,
  sitterName,
  role,
  onStatusChange,
  isUpdatingStatus,
  actionError,
  onFindBackup,
  backupSitters,
  isLoadingBackup,
  backupError,
  onBookBackup,
  isBookingBackup,
  onDeleteAvailability,
  isDeletingAvailability,
}) {
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

        {actionError && (
          <p className="calendar-event-details__error" role="alert">
            {actionError}
          </p>
        )}

        {role === "sitter" && onDeleteAvailability && (
          <div className="calendar-event-details__actions">
            <button
              type="button"
              className="calendar-event-details__button calendar-event-details__button--danger"
              disabled={isDeletingAvailability}
              onClick={() => onDeleteAvailability(resource.availability)}
            >
              {isDeletingAvailability ? "Removing..." : "Remove this slot"}
            </button>
          </div>
        )}
      </div>
    );
  }

  const booking = resource.booking || {};
  const status = resource.status || "pending";

  const canAccept = role === "sitter" && status === "pending";
  const canDecline = role === "sitter" && status === "pending";
  const canSitterCancel = role === "sitter" && status === "accepted";
  const canOwnerCancel =
    role === "owner" &&
    (status === "pending" || status === "accepted");
  const showBackupOption =
    role === "owner" &&
    status === "cancelled" &&
    booking.cancelledByRole === "sitter";

  const hasActions =
    canAccept || canDecline || canSitterCancel || canOwnerCancel;

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

      {actionError && (
        <p className="calendar-event-details__error" role="alert">
          {actionError}
        </p>
      )}

      {hasActions && (
        <div className="calendar-event-details__actions">
          {canAccept && (
            <button
              type="button"
              className="calendar-event-details__button calendar-event-details__button--primary"
              disabled={isUpdatingStatus}
              onClick={() => onStatusChange(booking, "accepted")}
            >
              Accept
            </button>
          )}

          {canDecline && (
            <button
              type="button"
              className="calendar-event-details__button calendar-event-details__button--secondary"
              disabled={isUpdatingStatus}
              onClick={() => onStatusChange(booking, "declined")}
            >
              Decline
            </button>
          )}

          {(canSitterCancel || canOwnerCancel) && (
            <button
              type="button"
              className="calendar-event-details__button calendar-event-details__button--danger"
              disabled={isUpdatingStatus}
              onClick={() => onStatusChange(booking, "cancelled")}
            >
              {isUpdatingStatus ? "Cancelling..." : "Cancel booking"}
            </button>
          )}
        </div>
      )}

      {showBackupOption && (
        <div className="calendar-event-details__backup">
          <p className="calendar-event-details__backup-notice">
            🆘 Your sitter had to cancel this booking. Find a backup
            sitter for the same time slot.
          </p>

          {!backupSitters && !isLoadingBackup && (
            <button
              type="button"
              className="calendar-event-details__button calendar-event-details__button--primary"
              onClick={() => onFindBackup(booking)}
            >
              Find backup sitter
            </button>
          )}

          {isLoadingBackup && <p>Searching for backup sitters...</p>}

          {backupError && (
            <p className="calendar-event-details__error" role="alert">
              {backupError}
            </p>
          )}

          {backupSitters && backupSitters.length === 0 && (
            <p>No backup sitters are available for this time slot yet.</p>
          )}

          {backupSitters && backupSitters.length > 0 && (
            <ul className="calendar-event-details__backup-list">
              {backupSitters.map((candidate) => (
                <li key={candidate.id}>
                  <div>
                    <strong>{candidate.name}</strong>
                    <span>
                      {candidate.city}, {candidate.state} · Trust{" "}
                      {candidate.trustScore} · {formatPrice(candidate.price)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="calendar-event-details__button calendar-event-details__button--primary"
                    disabled={isBookingBackup}
                    onClick={() => onBookBackup(booking, candidate)}
                  >
                    {isBookingBackup ? "Booking..." : "Book this sitter"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarEventDetails;