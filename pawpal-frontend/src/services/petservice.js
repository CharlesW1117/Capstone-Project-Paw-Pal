import { apiRequest, API_URL, ApiError } from "./api";

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

export async function uploadPetPhoto(petId, file) {
  const formData = new FormData();
  formData.append("photo", file);

  const data = await apiRequest(`/pets/${encodeURIComponent(petId)}/photo`, {
    method: "POST",
    body: formData,
  });

  return data.pet;
}

export async function fetchPetPhotoObjectUrl(petId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/pets/${encodeURIComponent(petId)}/photo`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  if (!response.ok) {
    throw new ApiError("Unable to load pet photo", response.status);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
