import "./AvailabilityPicker.css";

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
    weekday: "short",
    month: "short",
    day: "numeric",
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

function AvailabilityPicker({
  sitterName,
  availability,
  isLoading,
  error,
  selectedAvailabilityId,
  onSelect,
  onRetry,
}) {
  if (isLoading) {
    return (
      <div className="availability-picker__status" role="status">
        <span
          className="availability-picker__spinner"
          aria-hidden="true"
        />
        <span>Loading availability...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="availability-picker__error" role="alert">
        <p>{error}</p>

        <button type="button" onClick={onRetry}>
          <i className="fi fi-rr-refresh" aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  if (availability.length === 0) {
    return (
      <div className="availability-picker__empty">
        <i className="fi fi-rr-calendar-xmark" aria-hidden="true" />
        <p>{sitterName} has no open availability right now.</p>
      </div>
    );
  }

  return (
    <div className="availability-picker">
      <div className="availability-picker__heading">
        <h3>Choose an available time</h3>
        <p>Only future, unbooked times are shown.</p>
      </div>

      <div className="availability-picker__slots">
        {availability.map((slot) => {
          const isSelected = selectedAvailabilityId === slot.id;

          return (
            <button
              key={slot.id}
              className={`availability-picker__slot ${
                isSelected
                  ? "availability-picker__slot--selected"
                  : ""
              }`}
              type="button"
              onClick={() => onSelect(slot)}
              aria-pressed={isSelected}
            >
              <span className="availability-picker__date">
                <i
                  className="fi fi-rr-calendar"
                  aria-hidden="true"
                />
                {formatDate(slot.date)}
              </span>

              <span className="availability-picker__time">
                {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
              </span>

              {isSelected && (
                <i
                  className="fi fi-rr-check-circle"
                  aria-label="Selected"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AvailabilityPicker;