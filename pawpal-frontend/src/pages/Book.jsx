import { useCallback, useEffect, useState } from "react";
import BookingSummary from "../components/BookingSummary";
import SitterCard from "../components/SitterCard";
import SitterFilters from "../components/SitterFilters";
import { getSitterAvailability } from "../services/availabilityService";
import { createBooking } from "../services/bookingService";
import { getPets } from "../services/petservice";
import { getServices } from "../services/serviceService";
import { getSitters } from "../services/sitterService";
import "./Book.css";

const EMPTY_FILTERS = {
  service: "",
  city: "",
  state: "",
  zipCode: "",
  minRating: "",
};

function Book() {
  const [services, setServices] = useState([]);
  const [servicesError, setServicesError] = useState("");
  const [sitters, setSitters] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [pets, setPets] = useState([]);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [petsError, setPetsError] = useState("");
  const [selectedPetId, setSelectedPetId] = useState("");

  const [openSitterId, setOpenSitterId] = useState(null);
  const [availabilityBySitter, setAvailabilityBySitter] = useState({});
  const [selectedSitter, setSelectedSitter] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedAvailability, setSelectedAvailability] =
    useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    let shouldIgnore = false;

    async function loadServices() {
      try {
        const serviceResults = await getServices();

        if (!shouldIgnore) {
          setServices(serviceResults);
        }
      } catch (requestError) {
        if (!shouldIgnore) {
          setServicesError(
            requestError.message || "Unable to load services.",
          );
        }
      }
    }

    loadServices();

    return () => {
      shouldIgnore = true;
    };
  }, []);

  const loadPets = useCallback(async () => {
    setIsLoadingPets(true);
    setPetsError("");

    try {
      const petResults = await getPets();
      setPets(petResults);
    } catch (requestError) {
      setPetsError(
        requestError.message || "Unable to load your pets.",
      );
    } finally {
      setIsLoadingPets(false);
    }
  }, []);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const loadSitters = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const sitterResults = await getSitters(filters);
      setSitters(sitterResults);
    } catch (requestError) {
      setLoadError(
        requestError.message || "Unable to load sitters.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSitters();
  }, [loadSitters]);

  async function loadAvailability(sitterId) {
    setAvailabilityBySitter((currentState) => ({
      ...currentState,
      [sitterId]: {
        items: currentState[sitterId]?.items || [],
        isLoading: true,
        error: "",
      },
    }));

    try {
      const availabilityResults =
        await getSitterAvailability(sitterId);

      setAvailabilityBySitter((currentState) => ({
        ...currentState,
        [sitterId]: {
          items: availabilityResults,
          isLoading: false,
          error: "",
        },
      }));
    } catch (requestError) {
      setAvailabilityBySitter((currentState) => ({
        ...currentState,
        [sitterId]: {
          items: currentState[sitterId]?.items || [],
          isLoading: false,
          error:
            requestError.message ||
            "Unable to load this sitter's availability.",
        },
      }));
    }
  }

  function resetBookingSelection() {
    setSelectedSitter(null);
    setSelectedService(null);
    setSelectedAvailability(null);
    setSelectedPetId("");
    setBookingError("");
  }

  function applyFilters(nextFilters) {
    setFilters(nextFilters);
    setOpenSitterId(null);
    resetBookingSelection();
  }

  function chooseSitter(sitter) {
    if (selectedSitter?.id !== sitter.id) {
      setSelectedSitter(sitter);
      setSelectedService(null);
      setSelectedAvailability(null);
      setBookingError("");
      setBookingSuccess(null);
    }
  }

  function toggleAvailability(sitter) {
    const isCurrentlyOpen = openSitterId === sitter.id;

    if (isCurrentlyOpen) {
      setOpenSitterId(null);
      return;
    }

    chooseSitter(sitter);
    setOpenSitterId(sitter.id);

    if (!availabilityBySitter[sitter.id]) {
      loadAvailability(sitter.id);
    }
  }

  function selectService(sitter, service) {
    chooseSitter(sitter);
    setSelectedSitter(sitter);
    setSelectedService(service);
    setBookingError("");
    setBookingSuccess(null);
  }

  function selectAvailability(sitter, slot) {
    chooseSitter(sitter);
    setSelectedSitter(sitter);
    setSelectedAvailability(slot);
    setBookingError("");
    setBookingSuccess(null);
  }

  async function submitBooking() {
    if (
      !selectedSitter ||
      !selectedService ||
      !selectedAvailability ||
      !selectedPetId
    ) {
      setBookingError(
        "Choose a sitter, service, available time, and pet.",
      );
      return;
    }

    setIsSubmitting(true);
    setBookingError("");
    setBookingSuccess(null);

    const selectedPet = pets.find(
      (pet) => String(pet.id) === String(selectedPetId),
    );

    try {
      const booking = await createBooking({
        sitterId: selectedSitter.id,
        petId: Number(selectedPetId),
        sitterServiceId: selectedService.sitterServiceId,
        availabilityId: selectedAvailability.id,
      });

      setBookingSuccess({
        booking,
        pet: selectedPet,
        sitter: selectedSitter,
        service: selectedService,
        availability: selectedAvailability,
      });

      setAvailabilityBySitter((currentState) => ({
        ...currentState,
        [selectedSitter.id]: {
          ...currentState[selectedSitter.id],
          items: (
            currentState[selectedSitter.id]?.items || []
          ).filter(
            (slot) => slot.id !== selectedAvailability.id,
          ),
        },
      }));

      setOpenSitterId(null);
      resetBookingSelection();
    } catch (requestError) {
      setBookingError(
        requestError.message || "Unable to create this booking.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="book-page main-content">
      <header className="book-page__header">
        <p className="book-page__eyebrow">Book a service</p>
        <h1>Find a trusted pet sitter</h1>
        <p>
          Compare services, ratings, and locations before choosing
          care for your pet.
        </p>
      </header>

      <section className="book-page__search" aria-label="Sitter search">
        <SitterFilters
          services={services}
          initialFilters={filters}
          onApply={applyFilters}
          isLoading={isLoading}
          servicesError={servicesError}
        />
      </section>

      {bookingSuccess && (
        <div className="book-page__success" role="status">
          <i className="fi fi-rr-check-circle" aria-hidden="true" />

          <div>
            <h2>Booking request submitted</h2>
            <p>
              Your request for {bookingSuccess.pet?.name || "your pet"}{" "}
              with {bookingSuccess.sitter.name} is pending.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setBookingSuccess(null)}
            aria-label="Dismiss confirmation"
            title="Dismiss"
          >
            <i className="fi fi-rr-cross-small" aria-hidden="true" />
          </button>
        </div>
      )}

      <section
        className="book-page__results"
        aria-labelledby="sitter-results-heading"
      >
        <div className="book-page__results-heading">
          <div>
            <h2 id="sitter-results-heading">Available sitters</h2>

            {!isLoading && !loadError && (
              <p>
                {sitters.length}{" "}
                {sitters.length === 1 ? "sitter" : "sitters"} found
              </p>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="book-page__loading" role="status">
            <span className="book-page__spinner" aria-hidden="true" />
            <span>Searching for sitters...</span>
          </div>
        )}

        {!isLoading && loadError && (
          <div className="book-page__error" role="alert">
            <div>
              <h3>Sitters could not be loaded</h3>
              <p>{loadError}</p>
            </div>

            <button type="button" onClick={loadSitters}>
              <i className="fi fi-rr-refresh" aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        {!isLoading && !loadError && sitters.length === 0 && (
          <div className="book-page__empty">
            <i className="fi fi-rr-search" aria-hidden="true" />
            <h3>No sitters match these filters</h3>
            <p>Clear or adjust the filters to search again.</p>
          </div>
        )}

        {!isLoading && !loadError && sitters.length > 0 && (
          <div className="book-page__grid">
            {sitters.map((sitter) => {
              const availabilityState =
                availabilityBySitter[sitter.id] || {
                  items: [],
                  isLoading: false,
                  error: "",
                };

              const isSelectedSitter =
                selectedSitter?.id === sitter.id;

              return (
                <SitterCard
                  key={sitter.id}
                  sitter={sitter}
                  isAvailabilityOpen={openSitterId === sitter.id}
                  availability={availabilityState.items}
                  isAvailabilityLoading={
                    availabilityState.isLoading
                  }
                  availabilityError={availabilityState.error}
                  selectedSitterServiceId={
                    isSelectedSitter
                      ? selectedService?.sitterServiceId
                      : null
                  }
                  selectedAvailabilityId={
                    isSelectedSitter
                      ? selectedAvailability?.id
                      : null
                  }
                  onSelectService={selectService}
                  onToggleAvailability={toggleAvailability}
                  onSelectAvailability={selectAvailability}
                  onRetryAvailability={loadAvailability}
                />
              );
            })}
          </div>
        )}
      </section>

      {selectedSitter && (
        <section
          className="book-page__booking"
          aria-label="Booking summary"
        >
          <BookingSummary
            sitter={selectedSitter}
            service={selectedService}
            availability={selectedAvailability}
            pets={pets}
            selectedPetId={selectedPetId}
            onPetChange={setSelectedPetId}
            onSubmit={submitBooking}
            isLoadingPets={isLoadingPets}
            petsError={petsError}
            onRetryPets={loadPets}
            isSubmitting={isSubmitting}
            bookingError={bookingError}
          />
        </section>
      )}
    </main>
  );
}

export default Book;