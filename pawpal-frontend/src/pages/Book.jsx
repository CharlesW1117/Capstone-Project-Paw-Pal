import { useCallback, useEffect, useState } from "react";
import SitterCard from "../components/SitterCard";
import SitterFilters from "../components/SitterFilters";
import { getSitterAvailability } from "../services/availabilityService";
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

  const [openSitterId, setOpenSitterId] = useState(null);
  const [availabilityBySitter, setAvailabilityBySitter] = useState({});
  const [selectedSitter, setSelectedSitter] = useState(null);
  const [selectedAvailability, setSelectedAvailability] =
    useState(null);

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

  function applyFilters(nextFilters) {
    setFilters(nextFilters);
    setOpenSitterId(null);
    setSelectedSitter(null);
    setSelectedAvailability(null);
  }

  function toggleAvailability(sitter) {
    const isCurrentlyOpen = openSitterId === sitter.id;

    if (isCurrentlyOpen) {
      setOpenSitterId(null);
      return;
    }

    setOpenSitterId(sitter.id);

    if (!availabilityBySitter[sitter.id]) {
      loadAvailability(sitter.id);
    }
  }

  function selectAvailability(sitter, slot) {
    setSelectedSitter(sitter);
    setSelectedAvailability(slot);
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
                  selectedAvailabilityId={
                    selectedSitter?.id === sitter.id
                      ? selectedAvailability?.id
                      : null
                  }
                  onToggleAvailability={toggleAvailability}
                  onSelectAvailability={selectAvailability}
                  onRetryAvailability={loadAvailability}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Book;