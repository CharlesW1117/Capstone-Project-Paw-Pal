import "./PetCard.css";

function formatSpecies(species) {
  if (!species) {
    return "Pet";
  }

  return species.charAt(0).toUpperCase() + species.slice(1);
}

function formatAge(age) {
  if (age === null || age === undefined || age === "") {
    return "Age not provided";
  }

  return `${age} ${Number(age) === 1 ? "year" : "years"} old`;
}

function PetCard({ pet, onEdit, onDelete }) {
  const hasActions = onEdit || onDelete;

  return (
    <article className="pet-card">
      <div className="pet-card__image-area">
        {pet.photoUrl ? (
          <img
            className="pet-card__image"
            src={pet.photoUrl}
            alt={pet.name}
          />
        ) : (
          <div className="pet-card__image-placeholder" aria-hidden="true">
            <i className="fi fi-rr-paw" />
          </div>
        )}
      </div>

      <div className="pet-card__content">
        <div className="pet-card__heading">
          <div>
            <h2 className="pet-card__name">{pet.name}</h2>
            <p className="pet-card__species">
              {formatSpecies(pet.species)}
            </p>
          </div>

          {hasActions && (
            <div className="pet-card__actions">
              {onEdit && (
                <button
                  className="pet-card__action pet-card__action--edit"
                  type="button"
                  onClick={() => onEdit(pet)}
                  aria-label={`Edit ${pet.name}`}
                  title={`Edit ${pet.name}`}
                >
                  <i className="fi fi-rr-pencil" aria-hidden="true" />
                </button>
              )}

              {onDelete && (
                <button
                  className="pet-card__action pet-card__action--delete"
                  type="button"
                  onClick={() => onDelete(pet)}
                  aria-label={`Delete ${pet.name}`}
                  title={`Delete ${pet.name}`}
                >
                  <i className="fi fi-rr-trash" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>

        <dl className="pet-card__details">
          <div className="pet-card__detail">
            <dt>Breed</dt>
            <dd>{pet.breed || "Not provided"}</dd>
          </div>

          <div className="pet-card__detail">
            <dt>Age</dt>
            <dd>{formatAge(pet.age)}</dd>
          </div>
        </dl>

        <div className="pet-card__notes">
          <h3>Care and health information</h3>
          <p>{pet.careNotes || "No care notes have been added."}</p>
        </div>
      </div>
    </article>
  );
}

export default PetCard;