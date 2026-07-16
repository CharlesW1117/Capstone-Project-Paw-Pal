import { useState } from "react";
import "./PetForm.css";

function getInitialValues(pet) {
  return {
    name: pet?.name || "",
    species: pet?.species || "",
    breed: pet?.breed || "",
    age:
      pet?.age === null || pet?.age === undefined
        ? ""
        : String(pet.age),
    careNotes: pet?.careNotes || "",
    photoUrl: pet?.photoUrl || "",
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

  if (values.photoUrl.trim()) {
    try {
      const parsedUrl = new URL(values.photoUrl.trim());

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        errors.photoUrl = "Photo URL must start with http or https.";
      }
    } catch {
      errors.photoUrl = "Enter a valid photo URL.";
    }
  }

  return errors;
}

function PetForm({
  pet,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
}) {
  const [values, setValues] = useState(() => getInitialValues(pet));
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(pet);

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

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      name: values.name.trim(),
      species: values.species.trim(),
      breed: values.breed.trim(),
      age: values.age === "" ? null : Number(values.age),
      careNotes: values.careNotes.trim(),
      photoUrl: values.photoUrl.trim(),
    });
  }

  return (
    <form className="pet-form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="pet-form__server-error" role="alert">
          <i className="fi fi-rr-triangle-warning" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      )}

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
            aria-describedby={
              errors.species ? "pet-species-error" : undefined
            }
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
          <label htmlFor="pet-photo-url">Photo URL</label>

          <input
            id="pet-photo-url"
            name="photoUrl"
            type="url"
            value={values.photoUrl}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.photoUrl)}
            aria-describedby={
              errors.photoUrl
                ? "pet-photo-url-error"
                : "pet-photo-url-help"
            }
            placeholder="https://example.com/pet-photo.jpg"
            autoComplete="url"
          />

          {errors.photoUrl ? (
            <p
              id="pet-photo-url-error"
              className="pet-form__field-error"
            >
              {errors.photoUrl}
            </p>
          ) : (
            <p id="pet-photo-url-help" className="pet-form__field-help">
              Use a direct link to an image hosted online.
            </p>
          )}
        </div>

        <div className="pet-form__field pet-form__field--full">
          <label htmlFor="pet-care-notes">
            Care and health information
          </label>

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
            <span
              className="pet-form__button-spinner"
              aria-hidden="true"
            />
          )}

          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Add pet"}
        </button>
      </div>
    </form>
  );
}

export default PetForm;