import { useEffect, useState } from "react";
import { fetchPetPhotoObjectUrl } from "../../services/petservice";
import { getPhotoFileError } from "../../utils/photoValidation";
import "./PetForm.css";

function getInitialValues(pet) {
  return {
    name: pet?.name || "",
    species: pet?.species || "",
    breed: pet?.breed || "",
    age: pet?.age === null || pet?.age === undefined ? "" : String(pet.age),
    careNotes: pet?.careNotes || "",
  };
}

function validateForm(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Pet name is required.";
  }

  if (!values.species.trim()) {
    errors.species = "Species is required.";
  }

  if (values.age !== "") {
    const numericAge = Number(values.age);

    if (!Number.isInteger(numericAge) || numericAge < 0) {
      errors.age = "Age must be a whole number of zero or greater.";
    }
  }

  return errors;
}

function PetForm({ pet, onSubmit, onCancel, isSubmitting, serverError }) {
  const [values, setValues] = useState(() => getInitialValues(pet));
  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const [photoError, setPhotoError] = useState("");

  const isEditing = Boolean(pet);

  useEffect(() => {
    if (!pet?.hasPhoto) {
      return;
    }

    let cancelled = false;
    let objectUrl = null;

    fetchPetPhotoObjectUrl(pet.id)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        objectUrl = url;
        setPhotoPreviewUrl(url);
      })
      .catch(() => {
        // No existing photo to preview; the user can still choose a new one.
      });

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [pet]);

  useEffect(() => {
    if (!photoFile || !photoPreviewUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoFile, photoPreviewUrl]);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  }

  function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const validationError = getPhotoFileError(file);
    if (validationError) {
      setPhotoError(validationError);
      event.target.value = "";
      return;
    }

    setPhotoError("");
    setPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit(
      {
        name: values.name.trim(),
        species: values.species.trim(),
        breed: values.breed.trim(),
        age: values.age === "" ? null : Number(values.age),
        careNotes: values.careNotes.trim(),
      },
      photoFile,
    );
  }

  return (
    <form className="pet-form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="pet-form__server-error" role="alert">
          <i className="fi fi-rr-triangle-warning" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="pet-form__photo">
        <div className="pet-form__photo-preview">
          {photoPreviewUrl ? (
            <img src={photoPreviewUrl} alt="" />
          ) : (
            <i className="fi fi-rr-paw" aria-hidden="true" />
          )}
        </div>

        <div className="pet-form__field pet-form__photo-input">
          <label htmlFor="pet-photo">Photo</label>

          <input
            id="pet-photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            disabled={isSubmitting}
            aria-describedby={photoError ? "pet-photo-error" : "pet-photo-help"}
          />

          {photoError ? (
            <p id="pet-photo-error" className="pet-form__field-error">
              {photoError}
            </p>
          ) : (
            <p id="pet-photo-help" className="pet-form__field-help">
              JPEG, PNG, or WebP, up to 5MB.
            </p>
          )}
        </div>
      </div>

      <div className="pet-form__grid">
        <div className="pet-form__field">
          <label htmlFor="pet-name">
            Name
            <span aria-hidden="true"> *</span>
          </label>

          <input
            id="pet-name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "pet-name-error" : undefined}
            autoComplete="off"
          />

          {errors.name && (
            <p id="pet-name-error" className="pet-form__field-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="pet-form__field">
          <label htmlFor="pet-species">
            Species
            <span aria-hidden="true"> *</span>
          </label>

          <input
            id="pet-species"
            name="species"
            type="text"
            value={values.species}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.species)}
            aria-describedby={errors.species ? "pet-species-error" : undefined}
            placeholder="Dog, cat, bird..."
            autoComplete="off"
          />

          {errors.species && (
            <p id="pet-species-error" className="pet-form__field-error">
              {errors.species}
            </p>
          )}
        </div>

        <div className="pet-form__field">
          <label htmlFor="pet-breed">Breed</label>

          <input
            id="pet-breed"
            name="breed"
            type="text"
            value={values.breed}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Optional"
            autoComplete="off"
          />
        </div>

        <div className="pet-form__field">
          <label htmlFor="pet-age">Age</label>

          <input
            id="pet-age"
            name="age"
            type="number"
            min="0"
            step="1"
            value={values.age}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.age)}
            aria-describedby={errors.age ? "pet-age-error" : undefined}
            placeholder="Optional"
          />

          {errors.age && (
            <p id="pet-age-error" className="pet-form__field-error">
              {errors.age}
            </p>
          )}
        </div>

        <div className="pet-form__field pet-form__field--full">
          <label htmlFor="pet-care-notes">Care and health information</label>

          <textarea
            id="pet-care-notes"
            name="careNotes"
            value={values.careNotes}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Medication, allergies, feeding instructions, behavior..."
          />
        </div>
      </div>

      <div className="pet-form__actions">
        <button
          className="pet-form__button pet-form__button--secondary"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          className="pet-form__button pet-form__button--primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <span className="pet-form__button-spinner" aria-hidden="true" />
          )}

          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add pet"}
        </button>
      </div>
    </form>
  );
}

export default PetForm;
