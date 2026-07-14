import { useCallback, useEffect, useState } from "react";
import DeletePetDialog from "../components/pets/DeletePetDialog";
import Modal from "../components/Modal";
import PetForm from "../components/pets/PetForm";
import PetList from "../components/pets/PetList";
import {
  createPet,
  deletePet,
  getPets,
  updatePet,
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

  const loadPets = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const petResults = await getPets();
      setPets(petResults);
    } catch (requestError) {
      setLoadError(
        requestError.message || "Unable to load your pets.",
      );
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

  async function handleSavePet(petDetails) {
    setIsSaving(true);
    setFormError("");

    try {
      if (editingPet) {
        const savedPet = await updatePet(editingPet.id, petDetails);

        setPets((currentPets) =>
          currentPets.map((pet) =>
            pet.id === savedPet.id ? savedPet : pet,
          ),
        );
      } else {
        const savedPet = await createPet(petDetails);

        setPets((currentPets) => [savedPet, ...currentPets]);
      }

      setIsFormOpen(false);
      setEditingPet(null);
    } catch (requestError) {
      setFormError(
        requestError.message || "Unable to save this pet.",
      );
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
        currentPets.filter(
          (pet) => pet.id !== petPendingDelete.id,
        ),
      );

      setPetPendingDelete(null);
    } catch (requestError) {
      setDeleteError(
        requestError.message ||
          "Unable to delete this pet profile.",
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
    </main>
  );
}

export default Pets;