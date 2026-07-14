import "./ReviewList.css";

function formatReviewDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getInitials(name) {
  if (!name) {
    return "PO";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function ReviewStars({ rating }) {
  const numericRating = Math.min(
    Math.max(Number(rating) || 0, 0),
    5,
  );

  return (
    <div
      className="review-list__stars"
      aria-label={`${numericRating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <i
          key={index}
          className={
            index < numericRating
              ? "fi fi-sr-star"
              : "fi fi-rr-star"
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return (
      <div className="review-list__empty">
        <i className="fi fi-rr-comment-alt" aria-hidden="true" />
        <h2>No reviews yet</h2>
        <p>This sitter has not received any reviews.</p>
      </div>
    );
  }

  return (
    <section
      className="review-list"
      aria-labelledby="review-list-heading"
    >
      <header className="review-list__heading">
        <h2 id="review-list-heading">Client reviews</h2>
        <span>
          {reviews.length}{" "}
          {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </header>

      <div className="review-list__items">
        {reviews.map((review) => (
          <article className="review-list__item" key={review.id}>
            <header className="review-list__item-header">
              <div className="review-list__reviewer">
                <div
                  className="review-list__avatar"
                  aria-hidden="true"
                >
                  {getInitials(review.reviewerName)}
                </div>

                <div>
                  <h3>
                    {review.reviewerName || "PawPal owner"}
                  </h3>
                  <time dateTime={review.createdAt}>
                    {formatReviewDate(review.createdAt)}
                  </time>
                </div>
              </div>

              <ReviewStars rating={review.rating} />
            </header>

            <p className="review-list__comment">
              {review.comment || "No written comment was provided."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReviewList;