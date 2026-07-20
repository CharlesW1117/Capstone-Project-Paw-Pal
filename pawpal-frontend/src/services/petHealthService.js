import { apiRequest } from "./api";

export async function getPetHealth(petId) {
  const data = await apiRequest(`/pets/${encodeURIComponent(petId)}/health`);
  return data;
}

export async function updatePetHealth(petId, healthDetails) {
  const data = await apiRequest(`/pets/${encodeURIComponent(petId)}/health`, {
    method: "PUT",
    body: JSON.stringify(healthDetails),
  });

  return data.health;
}

export async function addVaccination(petId, vaccinationDetails) {
  const data = await apiRequest(
    `/pets/${encodeURIComponent(petId)}/vaccinations`,
    {
      method: "POST",
      body: JSON.stringify(vaccinationDetails),
    },
  );

  return data.vaccination;
}

export async function updateVaccination(
  petId,
  vaccinationId,
  vaccinationDetails,
) {
  const data = await apiRequest(
    `/pets/${encodeURIComponent(petId)}/vaccinations/${encodeURIComponent(
      vaccinationId,
    )}`,
    {
      method: "PUT",
      body: JSON.stringify(vaccinationDetails),
    },
  );

  return data.vaccination;
}

export async function deleteVaccination(petId, vaccinationId) {
  return apiRequest(
    `/pets/${encodeURIComponent(petId)}/vaccinations/${encodeURIComponent(
      vaccinationId,
    )}`,
    {
      method: "DELETE",
    },
  );
}
