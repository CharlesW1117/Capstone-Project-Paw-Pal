import "./DeletePetDialog.css";

function DeletePetDialog({
  pet,
  onConfirm,
  onCancel,
  isDeleting,
  error,
}) {
  return (
    <div className="delete-pet-dialog">
      <div className="delete-pet-dialog__message">
        <div className="delete-pet-dialog__icon" aria-hidden="true">
          <i className="fi fi-rr-trash" />
        </div>

        <div>
          <h3>Remove {pet.name} from your pet profiles?</h3>
          <p>
            This permanently removes the profile and its saved care
            information. This action cannot be undone.
          </p>
        </div>
      </div>

      {error && (
        <div className="delete-pet-dialog__error" role="alert">
          <i
            className="fi fi-rr-triangle-warning"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      )}

      <div className="delete-pet-dialog__actions">
        <button
          className="delete-pet-dialog__button delete-pet-dialog__button--cancel"
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
        >
          Cancel
        </button>

        <button
          className="delete-pet-dialog__button delete-pet-dialog__button--delete"
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting && (
            <span
              className="delete-pet-dialog__spinner"
              aria-hidden="true"
            />
          )}

          {isDeleting ? "Deleting..." : "Delete pet"}
        </button>
      </div>
    </div>
  );
}

export default DeletePetDialog;