import { useCallback, useEffect, useState } from "react";
import Toast from "../components/Toast";
import { getCurrentSession } from "../services/authServices";
import { getServices } from "../services/serviceService";
import { getSitterById } from "../services/sitterService";
import {
  addMyService,
  deleteMyService,
  submitBackgroundCheck,
  updateMyService,
} from "../services/sitterServiceManagement";
import "./SitterSettings.css";

const BACKGROUND_CHECK_LABELS = {
  not_submitted: "Not submitted",
  pending: "Pending review",
  verified: "Verified",
  rejected: "Rejected",
};

function SitterSettings() {
  const session = getCurrentSession();

  const [allServices, setAllServices] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [backgroundCheckStatus, setBackgroundCheckStatus] =
    useState("not_submitted");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [newPriceOverride, setNewPriceOverride] = useState("");
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceError, setServiceError] = useState("");

  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingPrice, setEditingPrice] = useState("");
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const [isSubmittingBackgroundCheck, setIsSubmittingBackgroundCheck] =
    useState(false);
  const [backgroundCheckError, setBackgroundCheckError] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const loadData = useCallback(async () => {
    if (session?.role !== "sitter") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError("");

    try {
      const [services, sitterProfile] = await Promise.all([
        getServices(),
        getSitterById(session.id),
      ]);

      setAllServices(services);
      setMyServices(sitterProfile.services || []);
      setBackgroundCheckStatus(
        sitterProfile.backgroundCheckStatus || "not_submitted",
      );
    } catch (requestError) {
      setLoadError(
        requestError.message || "Unable to load your sitter settings.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [session?.id, session?.role]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const availableServices = allServices.filter(
    (service) =>
      !myServices.some((mine) => mine.serviceId === service.id),
  );

  async function handleAddService(event) {
    event.preventDefault();

    if (!selectedServiceId) {
      setServiceError("Choose a service to add.");
      return;
    }

    setIsAddingService(true);
    setServiceError("");

    try {
      const created = await addMyService({
        serviceId: Number(selectedServiceId),
        priceOverride:
          newPriceOverride === "" ? null : Number(newPriceOverride),
      });

      setMyServices((current) => [...current, created]);
      setSelectedServiceId("");
      setNewPriceOverride("");
      setToastType("success");
      setToastMessage("Service added.");
    } catch (requestError) {
      setServiceError(
        requestError.message || "Unable to add this service.",
      );
    } finally {
      setIsAddingService(false);
    }
  }

  function startEditingPrice(service) {
    setEditingServiceId(service.sitterServiceId);
    setEditingPrice(String(service.price));
    setServiceError("");
  }

  function cancelEditingPrice() {
    setEditingServiceId(null);
    setEditingPrice("");
  }

  async function handleSavePrice(service) {
    const numericPrice = Number(editingPrice);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setServiceError("Enter a valid price.");
      return;
    }

    setIsSavingPrice(true);
    setServiceError("");

    try {
      const updated = await updateMyService(
        service.sitterServiceId,
        numericPrice,
      );

      setMyServices((current) =>
        current.map((item) =>
          item.sitterServiceId === service.sitterServiceId
            ? updated
            : item,
        ),
      );

      setEditingServiceId(null);
      setToastType("success");
      setToastMessage("Price updated.");
    } catch (requestError) {
      setServiceError(
        requestError.message || "Unable to update the price.",
      );
    } finally {
      setIsSavingPrice(false);
    }
  }

  async function handleDeleteService(service) {
    setPendingDeleteId(service.sitterServiceId);
    setServiceError("");

    try {
      await deleteMyService(service.sitterServiceId);

      setMyServices((current) =>
        current.filter(
          (item) => item.sitterServiceId !== service.sitterServiceId,
        ),
      );

      setToastType("success");
      setToastMessage("Service removed.");
    } catch (requestError) {
      setServiceError(
        requestError.message || "Unable to remove this service.",
      );
    } finally {
      setPendingDeleteId(null);
    }
  }

  async function handleSubmitBackgroundCheck() {
    setIsSubmittingBackgroundCheck(true);
    setBackgroundCheckError("");

    try {
      const data = await submitBackgroundCheck();
      setBackgroundCheckStatus(
        data.backgroundCheck.backgroundCheckStatus,
      );
      setToastType("success");
      setToastMessage("Background check submitted for review.");
    } catch (requestError) {
      setBackgroundCheckError(
        requestError.message ||
          "Unable to submit for a background check.",
      );
    } finally {
      setIsSubmittingBackgroundCheck(false);
    }
  }

  if (session?.role !== "sitter") {
    return (
      <p className="sitter-settings__status">
        This page is only available to sitter accounts.
      </p>
    );
  }

  if (isLoading) {
    return (
      <p className="sitter-settings__status">
        Loading your settings...
      </p>
    );
  }

  if (loadError) {
    return (
      <div className="sitter-settings__status">
        <p>{loadError}</p>
        <button type="button" onClick={loadData}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <main className="sitter-settings">
      <header className="sitter-settings__header">
        <p className="sitter-settings__eyebrow">Sitter tools</p>
        <h1>My Services &amp; Verification</h1>
        <p>
          Set the services you offer, your prices, and your background
          check status.
        </p>
      </header>

      <section className="sitter-settings__section">
        <h2>My services</h2>

        {myServices.length === 0 ? (
          <p className="sitter-settings__empty">
            You haven't listed any services yet — add one below so
            owners can find and book you.
          </p>
        ) : (
          <ul className="sitter-settings__service-list">
            {myServices.map((service) => (
              <li key={service.sitterServiceId}>
                <div>
                  <strong>{service.name}</strong>
                  {service.description && (
                    <span>{service.description}</span>
                  )}
                </div>

                {editingServiceId === service.sitterServiceId ? (
                  <div className="sitter-settings__price-edit">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingPrice}
                      onChange={(event) =>
                        setEditingPrice(event.target.value)
                      }
                      disabled={isSavingPrice}
                    />

                    <button
                      type="button"
                      onClick={() => handleSavePrice(service)}
                      disabled={isSavingPrice}
                    >
                      {isSavingPrice ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditingPrice}
                      disabled={isSavingPrice}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="sitter-settings__service-actions">
                    <span className="sitter-settings__price">
                      ${Number(service.price).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => startEditingPrice(service)}
                    >
                      Edit price
                    </button>

                    <button
                      type="button"
                      className="sitter-settings__delete-button"
                      onClick={() => handleDeleteService(service)}
                      disabled={
                        pendingDeleteId === service.sitterServiceId
                      }
                    >
                      {pendingDeleteId === service.sitterServiceId
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <form
          className="sitter-settings__add-service"
          onSubmit={handleAddService}
        >
          <div className="sitter-settings__add-service-fields">
            <select
              value={selectedServiceId}
              onChange={(event) =>
                setSelectedServiceId(event.target.value)
              }
              disabled={isAddingService || availableServices.length === 0}
            >
              <option value="">
                {availableServices.length === 0
                  ? "All services added"
                  : "Choose a service..."}
              </option>

              {availableServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} (${Number(service.basePrice).toFixed(2)}{" "}
                  default)
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Custom price (optional)"
              value={newPriceOverride}
              onChange={(event) =>
                setNewPriceOverride(event.target.value)
              }
              disabled={isAddingService}
            />

            <button
              type="submit"
              disabled={isAddingService || !selectedServiceId}
            >
              {isAddingService ? "Adding..." : "Add service"}
            </button>
          </div>

          {serviceError && (
            <p className="sitter-settings__error" role="alert">
              {serviceError}
            </p>
          )}
        </form>
      </section>

      <section className="sitter-settings__section">
        <h2>Background check</h2>

        <p>
          Status:{" "}
          <span
            className={`sitter-settings__badge sitter-settings__badge--${backgroundCheckStatus}`}
          >
            {BACKGROUND_CHECK_LABELS[backgroundCheckStatus] ||
              backgroundCheckStatus}
          </span>
        </p>

        {(backgroundCheckStatus === "not_submitted" ||
          backgroundCheckStatus === "rejected") && (
          <button
            type="button"
            onClick={handleSubmitBackgroundCheck}
            disabled={isSubmittingBackgroundCheck}
          >
            {isSubmittingBackgroundCheck
              ? "Submitting..."
              : backgroundCheckStatus === "rejected"
                ? "Resubmit for background check"
                : "Submit for background check"}
          </button>
        )}

        {backgroundCheckError && (
          <p className="sitter-settings__error" role="alert">
            {backgroundCheckError}
          </p>
        )}
      </section>

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage("")}
      />
    </main>
  );
}

export default SitterSettings;
