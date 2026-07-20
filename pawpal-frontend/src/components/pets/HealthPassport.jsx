import { useCallback, useEffect, useState } from "react";
import {
  addVaccination,
  deleteVaccination,
  getPetHealth,
  updatePetHealth,
} from "../../services/petHealthService";
import "./HealthPassport.css";

const EMPTY_HEALTH = {
  vetName: "",
  vetPhone: "",
  microchipNumber: "",
  weightLbs: "",
  allergies: "",
  medications: "",
  spayedNeutered: false,
};

const EMPTY_VACCINATION = {
  vaccineName: "",
  administeredDate: "",
  expirationDate: "",
  notes: "",
};

function getVaccinationStatus(expirationDate) {
  if (!expirationDate) {
    return { label: "No expiration on file", tone: "neutral" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(`${expirationDate}T00:00:00`);
  const daysRemaining = Math.round(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysRemaining < 0) {
    return { label: "Expired", tone: "danger" };
  }

  if (daysRemaining <= 30) {
    return { label: "Expiring soon", tone: "warning" };
  }

  return { label: "Up to date", tone: "success" };
}

function HealthPassport({ pet }) {
  const [health, setHealth] = useState(EMPTY_HEALTH);
  const [vaccinations, setVaccinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isSavingHealth, setIsSavingHealth] = useState(false);
  const [healthError, setHealthError] = useState("");
  const [healthSaved, setHealthSaved] = useState(false);

  const [newVaccination, setNewVaccination] = useState(EMPTY_VACCINATION);
  const [isAddingVaccination, setIsAddingVaccination] = useState(false);
  const [vaccinationError, setVaccinationError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const loadHealth = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await getPetHealth(pet.id);

      setHealth({
        vetName: data.health.vetName || "",
        vetPhone: data.health.vetPhone || "",
        microchipNumber: data.health.microchipNumber || "",
        weightLbs:
          data.health.weightLbs === null
            ? ""
            : String(data.health.weightLbs),
        allergies: data.health.allergies || "",
        medications: data.health.medications || "",
        spayedNeutered: Boolean(data.health.spayedNeutered),
      });

      setVaccinations(data.vaccinations);
    } catch (requestError) {
      setLoadError(
        requestError.message ||
          "Unable to load this pet's health passport.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [pet.id]);

  useEffect(() => {
    loadHealth();
  }, [loadHealth]);

  function handleHealthChange(event) {
    const { name, value, type, checked } = event.target;

    setHealthSaved(false);

    setHealth((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSaveHealth(event) {
    event.preventDefault();
    setIsSavingHealth(true);
    setHealthError("");
    setHealthSaved(false);

    try {
      await updatePetHealth(pet.id, {
        vetName: health.vetName.trim() || null,
        vetPhone: health.vetPhone.trim() || null,
        microchipNumber: health.microchipNumber.trim() || null,
        weightLbs:
          health.weightLbs === "" ? null : Number(health.weightLbs),
        allergies: health.allergies.trim() || null,
        medications: health.medications.trim() || null,
        spayedNeutered: health.spayedNeutered,
      });

      setHealthSaved(true);
    } catch (requestError) {
      setHealthError(
        requestError.message || "Unable to save health information.",
      );
    } finally {
      setIsSavingHealth(false);
    }
  }

  function handleNewVaccinationChange(event) {
    const { name, value } = event.target;

    setNewVaccination((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleAddVaccination(event) {
    event.preventDefault();

    if (
      !newVaccination.vaccineName.trim() ||
      !newVaccination.administeredDate
    ) {
      setVaccinationError(
        "Vaccine name and date given are required.",
      );
      return;
    }

    setIsAddingVaccination(true);
    setVaccinationError("");

    try {
      const created = await addVaccination(pet.id, {
        vaccineName: newVaccination.vaccineName.trim(),
        administeredDate: newVaccination.administeredDate,
        expirationDate: newVaccination.expirationDate || null,
        notes: newVaccination.notes.trim() || null,
      });

      setVaccinations((current) => [created, ...current]);
      setNewVaccination(EMPTY_VACCINATION);
    } catch (requestError) {
      setVaccinationError(
        requestError.message ||
          "Unable to add this vaccination record.",
      );
    } finally {
      setIsAddingVaccination(false);
    }
  }

  async function handleDeleteVaccination(vaccination) {
    setPendingDeleteId(vaccination.id);
    setVaccinationError("");

    try {
      await deleteVaccination(pet.id, vaccination.id);

      setVaccinations((current) =>
        current.filter((item) => item.id !== vaccination.id),
      );
    } catch (requestError) {
      setVaccinationError(
        requestError.message ||
          "Unable to delete this vaccination record.",
      );
    } finally {
      setPendingDeleteId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="health-passport__loading" role="status">
        <span className="health-passport__spinner" aria-hidden="true" />
        <span>Loading health passport...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="health-passport">
        <p className="health-passport__error" role="alert">
          {loadError}
        </p>

        <button
          type="button"
          className="health-passport__button health-passport__button--secondary"
          onClick={loadHealth}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="health-passport">
      <form
        className="health-passport__section"
        onSubmit={handleSaveHealth}
      >
        <h3>Vet &amp; medical details</h3>

        <div className="health-passport__grid">
          <div className="health-passport__field">
            <label htmlFor="hp-vet-name">Vet name</label>
            <input
              id="hp-vet-name"
              name="vetName"
              type="text"
              value={health.vetName}
              onChange={handleHealthChange}
              disabled={isSavingHealth}
            />
          </div>

          <div className="health-passport__field">
            <label htmlFor="hp-vet-phone">Vet phone</label>
            <input
              id="hp-vet-phone"
              name="vetPhone"
              type="tel"
              value={health.vetPhone}
              onChange={handleHealthChange}
              disabled={isSavingHealth}
            />
          </div>

          <div className="health-passport__field">
            <label htmlFor="hp-microchip">Microchip number</label>
            <input
              id="hp-microchip"
              name="microchipNumber"
              type="text"
              value={health.microchipNumber}
              onChange={handleHealthChange}
              disabled={isSavingHealth}
            />
          </div>

          <div className="health-passport__field">
            <label htmlFor="hp-weight">Weight (lbs)</label>
            <input
              id="hp-weight"
              name="weightLbs"
              type="number"
              min="0.1"
              step="0.1"
              value={health.weightLbs}
              onChange={handleHealthChange}
              disabled={isSavingHealth}
            />
          </div>

          <div className="health-passport__field health-passport__field--checkbox">
            <label htmlFor="hp-spayed">
              <input
                id="hp-spayed"
                name="spayedNeutered"
                type="checkbox"
                checked={health.spayedNeutered}
                onChange={handleHealthChange}
                disabled={isSavingHealth}
              />
              Spayed / neutered
            </label>
          </div>

          <div className="health-passport__field health-passport__field--full">
            <label htmlFor="hp-allergies">Allergies</label>
            <textarea
              id="hp-allergies"
              name="allergies"
              value={health.allergies}
              onChange={handleHealthChange}
              disabled={isSavingHealth}
              placeholder="Food, medication, or environmental allergies"
            />
          </div>

          <div className="health-passport__field health-passport__field--full">
            <label htmlFor="hp-medications">Medications</label>
            <textarea
              id="hp-medications"
              name="medications"
              value={health.medications}
              onChange={handleHealthChange}
              disabled={isSavingHealth}
              placeholder="Ongoing medications and dosages"
            />
          </div>
        </div>

        {healthError && (
          <p className="health-passport__error" role="alert">
            {healthError}
          </p>
        )}

        <div className="health-passport__actions">
          {healthSaved && !isSavingHealth && (
            <span className="health-passport__saved">Saved</span>
          )}

          <button
            type="submit"
            className="health-passport__button health-passport__button--primary"
            disabled={isSavingHealth}
          >
            {isSavingHealth ? "Saving..." : "Save health details"}
          </button>
        </div>
      </form>

      <div className="health-passport__section">
        <h3>Vaccinations</h3>

        {vaccinations.length === 0 ? (
          <p className="health-passport__empty">
            No vaccination records yet.
          </p>
        ) : (
          <ul className="health-passport__vaccination-list">
            {vaccinations.map((vaccination) => {
              const status = getVaccinationStatus(
                vaccination.expirationDate,
              );

              return (
                <li key={vaccination.id}>
                  <div>
                    <strong>{vaccination.vaccineName}</strong>
                    <span>
                      Given {vaccination.administeredDate}
                      {vaccination.expirationDate &&
                        ` · Expires ${vaccination.expirationDate}`}
                    </span>
                    {vaccination.notes && (
                      <span>{vaccination.notes}</span>
                    )}
                  </div>

                  <div className="health-passport__vaccination-meta">
                    <span
                      className={`health-passport__status health-passport__status--${status.tone}`}
                    >
                      {status.label}
                    </span>

                    <button
                      type="button"
                      className="health-passport__icon-button"
                      onClick={() => handleDeleteVaccination(vaccination)}
                      disabled={pendingDeleteId === vaccination.id}
                      aria-label={`Delete ${vaccination.vaccineName} record`}
                      title="Delete record"
                    >
                      <i className="fi fi-rr-trash" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <form
          className="health-passport__add-vaccination"
          onSubmit={handleAddVaccination}
        >
          <div className="health-passport__grid">
            <div className="health-passport__field">
              <label htmlFor="hp-vaccine-name">Vaccine</label>
              <input
                id="hp-vaccine-name"
                name="vaccineName"
                type="text"
                value={newVaccination.vaccineName}
                onChange={handleNewVaccinationChange}
                disabled={isAddingVaccination}
                placeholder="Rabies"
              />
            </div>

            <div className="health-passport__field">
              <label htmlFor="hp-administered-date">Date given</label>
              <input
                id="hp-administered-date"
                name="administeredDate"
                type="date"
                value={newVaccination.administeredDate}
                onChange={handleNewVaccinationChange}
                disabled={isAddingVaccination}
              />
            </div>

            <div className="health-passport__field">
              <label htmlFor="hp-expiration-date">
                Expires (optional)
              </label>
              <input
                id="hp-expiration-date"
                name="expirationDate"
                type="date"
                value={newVaccination.expirationDate}
                onChange={handleNewVaccinationChange}
                disabled={isAddingVaccination}
              />
            </div>

            <div className="health-passport__field health-passport__field--full">
              <label htmlFor="hp-vaccine-notes">Notes (optional)</label>
              <input
                id="hp-vaccine-notes"
                name="notes"
                type="text"
                value={newVaccination.notes}
                onChange={handleNewVaccinationChange}
                disabled={isAddingVaccination}
                placeholder="Administering vet, lot number, etc."
              />
            </div>
          </div>

          {vaccinationError && (
            <p className="health-passport__error" role="alert">
              {vaccinationError}
            </p>
          )}

          <div className="health-passport__actions">
            <button
              type="submit"
              className="health-passport__button health-passport__button--secondary"
              disabled={isAddingVaccination}
            >
              {isAddingVaccination ? "Adding..." : "Add vaccination"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HealthPassport;
