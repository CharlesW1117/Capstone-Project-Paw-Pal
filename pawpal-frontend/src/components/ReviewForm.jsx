import { useState } from "react";
import "./ReviewForm.css";

function formatBookingDate(value) {
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
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function ReviewForm({
  bookings,
  sitterName,
  onSubmit,
  isSubmitting,
  error,
}) {
  const [bookingId, setBookingId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    if (!bookingId) {
      setValidationError("Choose a completed booking.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setValidationError("Choose a rating from 1 to 5 stars.");
      return;
    }

    onSubmit({
      bookingId: Number(bookingId),
      rating,
      comment: comment.trim(),
    });
  }

  if (bookings.length === 0) {
    return (
      <section className="review-form review-form--empty">
        <div className="review-form__empty-icon" aria-hidden="true">
          <i className="fi fi-rr-calendar-xmark" />
        </div>

        <div>
          <h2>No completed bookings to review</h2>
          <p>
            Completed bookings with {sitterName} will appear here if
            they have not already been reviewed.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="review-form"
      aria-labelledby="review-form-heading"
    >
      <header className="review-form__header">
        <div>
          <p>Share your experience</p>
          <h2 id="review-form-heading">Write a review</h2>
        </div>

        <i className="fi fi-rr-star-comment-alt" aria-hidden="true" />
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <div className="review-form__field">
          <label htmlFor="review-booking">Completed booking</label>

          <select
            id="review-booking"
            value={bookingId}
            onChange={(event) => {
              setBookingId(event.target.value);
              setValidationError("");
            }}
            disabled={isSubmitting}
          >
            <option value="">Choose a booking</option>

            {bookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {booking.petName} - {booking.serviceName} -{" "}
                {formatBookingDate(booking.date)}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="review-form__rating">
          <legend>Rating</legend>

          <div className="review-form__stars">
            {Array.from({ length: 5 }, (_, index) => {
              const starValue = index + 1;
              const isSelected = starValue <= rating;

              return (
                <button
                  key={starValue}
                  className={
                    isSelected
                      ? "review-form__star review-form__star--selected"
                      : "review-form__star"
                  }
                  type="button"
                  onClick={() => {
                    setRating(starValue);
                    setValidationError("");
                  }}
                  disabled={isSubmitting}
                  aria-label={`${starValue} ${
                    starValue === 1 ? "star" : "stars"
                  }`}
                  aria-pressed={rating === starValue}
                >
                  <i
                    className={
                      isSelected
                        ? "fi fi-sr-star"
                        : "fi fi-rr-star"
                    }
                    aria-hidden="true"
                  />
                </button>
              );
            })}

            <span>
              {rating > 0
                ? `${rating} out of 5`
                : "Choose a rating"}
            </span>
          </div>
        </fieldset>

        <div className="review-form__field">
          <div className="review-form__label-row">
            <label htmlFor="review-comment">Comment</label>
            <span>{comment.length}/1000</span>
          </div>

          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            disabled={isSubmitting}
            maxLength="1000"
            placeholder="Share details about your experience..."
          />
        </div>

        {(validationError || error) && (
          <div className="review-form__error" role="alert">
            <i
              className="fi fi-rr-triangle-warning"
              aria-hidden="true"
            />
            <span>{validationError || error}</span>
          </div>
        )}

        <button
          className="review-form__submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <span className="review-form__spinner" aria-hidden="true" />
          )}

          {isSubmitting ? "Submitting..." : "Submit review"}
        </button>
      </form>
    </section>
  );
}

export default ReviewForm;