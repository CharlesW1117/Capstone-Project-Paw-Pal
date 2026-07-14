import { useCallback, useEffect, useState } from "react";
import PetList from "../components/PetList";
import { getPets } from "../services/petservice";
import "./Pets.css";

function Pets() {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPets = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const petResults = await getPets();
      setPets(petResults);
    } catch (requestError) {
      setError(requestError.message || "Unable to load your pets.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  return (
    <main className="pets-page main-content">
      <header className="pets-page__header">
        <div>
          <p className="pets-page__eyebrow">Pet profiles</p>
          <h1 className="pets-page__title">Your pets</h1>
          <p className="pets-page__description">
            Keep care details ready for every booking.
          </p>
        </div>
      </header>

      {isLoading && (
        <div className="pets-page__loading" role="status">
          <span className="pets-page__spinner" aria-hidden="true" />
          <span>Loading pet profiles...</span>
        </div>
      )}

      {!isLoading && error && (
        <div className="pets-page__error" role="alert">
          <div>
            <h2>Pet profiles could not be loaded</h2>
            <p>{error}</p>
          </div>

          <button type="button" onClick={loadPets}>
            <i className="fi fi-rr-refresh" aria-hidden="true" />
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && <PetList pets={pets} />}
    </main>
  );
}

export default Pets;