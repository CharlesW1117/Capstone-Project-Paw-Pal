import { apiRequest } from "./api";

export async function getPets() {
  const data = await apiRequest("/pets");
  return data.pets;
}

export async function getPetById(petId) {
  const data = await apiRequest(`/pets/${encodeURIComponent(petId)}`);
  return data.pet;
}

export async function createPet(petDetails) {
  const data = await apiRequest("/pets", {
    method: "POST",
    body: JSON.stringify(petDetails),
  });

  return data.pet;
}

export async function updatePet(petId, petDetails) {
  const data = await apiRequest(`/pets/${encodeURIComponent(petId)}`, {
    method: "PUT",
    body: JSON.stringify(petDetails),
  });

  return data.pet;
}

export async function deletePet(petId) {
  return apiRequest(`/pets/${encodeURIComponent(petId)}`, {
    method: "DELETE",
  });
}