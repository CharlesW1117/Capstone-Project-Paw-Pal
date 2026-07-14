import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import RatingSummary from "../components/RatingSummary";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { getCurrentSession } from "../services/authServices";
import { getBookings } from "../services/bookingService";
import { createReview } from "../services/reviewService";
import {
  getSitterById,
  getSitters,
} from "../services/sitterService";
import "./Reviews.css";

function Reviews() {
  const session = useMemo(() => getCurrentSession(), []);

  const [sitters, setSitters] = useState([]);
  const [selectedSitterId, setSelectedSitterId] = useState("");
  const [selectedSitter, setSelectedSitter] = useState(null);

  const [isLoadingSitters, setIsLoadingSitters] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [sittersError, setSittersError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");

  const [isSubmittingReview, setIsSubmittingReview] =
    useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewFormKey, setReviewFormKey] = useState(0);

  const loadSitters = useCallback(async () => {
    setIsLoadingSitters(true);
    setSittersError("");

    try {
      const sitterResults = await getSitters();
      setSitters(sitterResults);

      setSelectedSitterId((currentId) => {
        if (currentId) {
          return currentId;
        }

        return sitterResults[0]
          ? String(sitterResults[0].id)
          : "";
      });
    } catch (requestError) {
      setSittersError(
        requestError.message || "Unable to load sitters.",
      );
    } finally {
      setIsLoadingSitters(false);
    }
  }, []);

  const loadSitterDetails = useCallback(async () => {
    if (!selectedSitterId) {
      setSelectedSitter(null);
      return;
    }

    setIsLoadingDetails(true);
    setDetailsError("");

    try {
      const sitterResult = await getSitterById(selectedSitterId);
      setSelectedSitter(sitterResult);
    } catch (requestError) {
      setSelectedSitter(null);
      setDetailsError(
        requestError.message ||
          "Unable to load this sitter's reviews.",
      );
    } finally {
      setIsLoadingDetails(false);
    }
  }, [selectedSitterId]);

  const loadBookings = useCallback(async () => {
    if (session?.role !== "owner") {
      setBookings([]);
      return;
    }

    setIsLoadingBookings(true);
    setBookingsError("");

    try {
      const bookingResults = await getBookings();
      setBookings(bookingResults);
    } catch (requestError) {
      setBookingsError(
        requestError.message || "Unable to load your bookings.",
      );
    } finally {
      setIsLoadingBookings(false);
    }
  }, [session?.role]);

  useEffect(() => {
    loadSitters();
  }, [loadSitters]);

  useEffect(() => {
    loadSitterDetails();
  }, [loadSitterDetails]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const eligibleBookings = useMemo(() => {
    if (!selectedSitter) {
      return [];
    }

    const reviewedBookingIds = new Set(
      (selectedSitter.reviews || []).map((review) =>
        String(review.bookingId),
      ),
    );

    return bookings.filter((booking) => {
      return (
        booking.status === "completed" &&
        String(booking.sitterId) === String(selectedSitter.id) &&
        !reviewedBookingIds.has(String(booking.id))
      );
    });
  }, [bookings, selectedSitter]);

  async function submitReview(reviewDetails) {
    setIsSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      await createReview(reviewDetails);

      setReviewSuccess("Your review was submitted successfully.");
      setReviewFormKey((currentKey) => currentKey + 1);

      await loadSitterDetails();
    } catch (requestError) {
      setReviewError(
        requestError.message || "Unable to submit your review.",
      );
    } finally {
      setIsSubmittingReview(false);
    }
  }

  function changeSelectedSitter(event) {
    setSelectedSitterId(event.target.value);
    setReviewError("");
    setReviewSuccess("");
    setReviewFormKey((currentKey) => currentKey + 1);
  }

  function refreshReviews() {
    loadSitters();
    loadSitterDetails();
    loadBookings();
  }

  const isLoading =
    isLoadingSitters ||
    isLoadingDetails ||
    isLoadingBookings;

  return (
    <main className="reviews-page main-content">
      <header className="reviews-page__header">
        <div>
          <p className="reviews-page__eyebrow">Reviews</p>
          <h1>Sitter ratings and feedback</h1>
          <p>
            Read client experiences and compare sitter reliability.
          </p>
        </div>

        <button
          className="reviews-page__refresh"
          type="button"
          onClick={refreshReviews}
          disabled={isLoading}
        >
          <i className="fi fi-rr-refresh" aria-hidden="true" />
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <section className="reviews-page__controls">
        <div className="reviews-page__sitter-field">
          <label htmlFor="reviews-sitter">Choose a sitter</label>

          <select
            id="reviews-sitter"
            value={selectedSitterId}
            onChange={changeSelectedSitter}
            disabled={isLoadingSitters || sitters.length === 0}
          >
            {sitters.length === 0 && (
              <option value="">No sitters available</option>
            )}

            {sitters.map((sitter) => (
              <option key={sitter.id} value={sitter.id}>
                {sitter.name} - {sitter.city}, {sitter.state}
              </option>
            ))}
          </select>
        </div>

        {selectedSitter && (
          <div className="reviews-page__selected-sitter">
            <strong>{selectedSitter.name}</strong>
            <span>
              {selectedSitter.city}, {selectedSitter.state}
            </span>
          </div>
        )}
      </section>

      {sittersError && (
        <div className="reviews-page__error" role="alert">
          <p>{sittersError}</p>
          <button type="button" onClick={loadSitters}>
            Try again
          </button>
        </div>
      )}

      {detailsError && (
        <div className="reviews-page__error" role="alert">
          <p>{detailsError}</p>
          <button type="button" onClick={loadSitterDetails}>
            Try again
          </button>
        </div>
      )}

      {isLoading && (
        <div className="reviews-page__loading" role="status">
          <span className="reviews-page__spinner" aria-hidden="true" />
          <span>Loading reviews...</span>
        </div>
      )}

      {!isLoading && selectedSitter && (
        <div className="reviews-page__content">
          <RatingSummary sitter={selectedSitter} />

          {session?.role === "owner" && (
            <>
              {reviewSuccess && (
                <div className="reviews-page__success" role="status">
                  <i
                    className="fi fi-rr-check-circle"
                    aria-hidden="true"
                  />
                  <span>{reviewSuccess}</span>
                </div>
              )}

              <ReviewForm
                key={`${selectedSitter.id}-${reviewFormKey}`}
                bookings={eligibleBookings}
                sitterName={selectedSitter.name}
                onSubmit={submitReview}
                isSubmitting={isSubmittingReview}
                error={reviewError || bookingsError}
              />
            </>
          )}

          <ReviewList reviews={selectedSitter.reviews || []} />
        </div>
      )}

      {!isLoading &&
        !selectedSitter &&
        !sittersError &&
        !detailsError && (
          <div className="reviews-page__empty">
            <i className="fi fi-rr-star-comment-alt" aria-hidden="true" />
            <h2>No sitter reviews available</h2>
            <p>There are no sitter profiles available to review.</p>
          </div>
        )}
    </main>
  );
}

export default Reviews;