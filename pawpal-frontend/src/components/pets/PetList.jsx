import PetCard from "./PetCard";
import "./PetList.css";

function PetList({ pets, onEdit, onDelete, onOpenHealth }) {
  if (pets.length === 0) {
    return (
      <div className="pet-list__empty">
        <i className="fi fi-rr-paw" aria-hidden="true" />
        <h2>No pet profiles yet</h2>
        <p>Add your first pet to keep their important details together.</p>
      </div>
    );
  }

  return (
    <div className="pet-list">
      {pets.map((pet) => (
        <PetCard
          key={pet.id}
          pet={pet}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpenHealth={onOpenHealth}
        />
      ))}
    </div>
  );
}

export default PetList;