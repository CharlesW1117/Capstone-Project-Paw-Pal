import { useCallback, useEffect, useState } from "react";
import DeletePetDialog from "../components/pets/DeletePetDialog";
import HealthPassport from "../components/pets/HealthPassport";
import Modal from "../components/Modal";
import PetForm from "../components/pets/PetForm";
import PetList from "../components/pets/PetList";
import Toast from "../components/Toast";
import {
  createPet,
  deletePet,
  getPets,
  updatePet,
  uploadPetPhoto,
} from "../services/petservice";
import "./Pets.css";

function Pets() {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [petPendingDelete, setPetPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [healthPet, setHealthPet] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const loadPets = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const petResults = await getPets();
      setPets(petResults);
    } catch (requestError) {
      setLoadError(requestError.message || "Unable to load your pets.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  function openCreateForm() {
    setEditingPet(null);
    setFormError("");
    setIsFormOpen(true);
  }

  function openEditForm(pet) {
    setEditingPet(pet);
    setFormError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setEditingPet(null);
    setFormError("");
  }

  async function handleSavePet(petDetails, photoFile) {
    setIsSaving(true);
    setFormError("");

    try {
      const savedPet = editingPet
        ? await updatePet(editingPet.id, petDetails)
        : await createPet(petDetails);

      let finalPet = savedPet;
      let photoUploadError = "";

      if (photoFile) {
        try {
          finalPet = await uploadPetPhoto(savedPet.id, photoFile);
        } catch (uploadError) {
          photoUploadError =
            uploadError.message || "Unable to upload the photo.";
        }
      }

      if (editingPet) {
        setPets((currentPets) =>
          currentPets.map((pet) => (pet.id === finalPet.id ? finalPet : pet)),
        );
      } else {
        setPets((currentPets) => [finalPet, ...currentPets]);
      }

      if (photoUploadError) {
        setToastMessage(
          `${finalPet.name} was ${
            editingPet ? "updated" : "added"
          }, but the photo failed to upload: ${photoUploadError}`,
        );
        setToastType("error");
      } else {
        setToastMessage(
          editingPet
            ? `${finalPet.name} was updated.`
            : `${finalPet.name} was added! 🎉`,
        );
        setToastType("success");
      }

      setIsFormOpen(false);
      setEditingPet(null);
    } catch (requestError) {
      setFormError(requestError.message || "Unable to save this pet.");
    } finally {
      setIsSaving(false);
    }
  }

  function openDeleteDialog(pet) {
    setPetPendingDelete(pet);
    setDeleteError("");
  }

  function closeDeleteDialog() {
    if (isDeleting) {
      return;
    }

    setPetPendingDelete(null);
    setDeleteError("");
  }

  async function handleDeletePet() {
    if (!petPendingDelete) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deletePet(petPendingDelete.id);

      setPets((currentPets) =>
        currentPets.filter((pet) => pet.id !== petPendingDelete.id),
      );

      setToastMessage(`${petPendingDelete.name} was removed.`);
      setToastType("success");

      setPetPendingDelete(null);
    } catch (requestError) {
      setDeleteError(
        requestError.message || "Unable to delete this pet profile.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

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

        <button
          className="pets-page__add-button"
          type="button"
          onClick={openCreateForm}
        >
          <i className="fi fi-rr-plus" aria-hidden="true" />
          Add pet
        </button>
      </header>

      {isLoading && (
        <div className="pets-page__loading" role="status">
          <span className="pets-page__spinner" aria-hidden="true" />
          <span>Loading pet profiles...</span>
        </div>
      )}

      {!isLoading && loadError && (
        <div className="pets-page__error" role="alert">
          <div>
            <h2>Pet profiles could not be loaded</h2>
            <p>{loadError}</p>
          </div>

          <button type="button" onClick={loadPets}>
            <i className="fi fi-rr-refresh" aria-hidden="true" />
            Try again
          </button>
        </div>
      )}

      {!isLoading && !loadError && (
        <PetList
          pets={pets}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          onOpenHealth={setHealthPet}
        />
      )}

      {isFormOpen && (
        <Modal
          title={editingPet ? `Edit ${editingPet.name}` : "Add a pet"}
          onClose={closeForm}
          isCloseDisabled={isSaving}
        >
          <PetForm
            key={editingPet?.id || "new-pet"}
            pet={editingPet}
            onSubmit={handleSavePet}
            onCancel={closeForm}
            isSubmitting={isSaving}
            serverError={formError}
          />
        </Modal>
      )}

      {petPendingDelete && (
        <Modal
          title="Delete pet profile"
          onClose={closeDeleteDialog}
          isCloseDisabled={isDeleting}
        >
          <DeletePetDialog
            pet={petPendingDelete}
            onConfirm={handleDeletePet}
            onCancel={closeDeleteDialog}
            isDeleting={isDeleting}
            error={deleteError}
          />
        </Modal>
      )}

      {healthPet && (
        <Modal
          title={`${healthPet.name}'s health passport`}
          onClose={() => setHealthPet(null)}
        >
          <HealthPassport pet={healthPet} />
        </Modal>
      )}

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage("")}
      />
    </main>
  );
}

export default Pets;
