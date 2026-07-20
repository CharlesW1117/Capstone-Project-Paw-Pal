import { apiRequest } from "./api";

export async function getSitterAvailability(sitterId) {
  const data = await apiRequest(
    `/sitters/${encodeURIComponent(sitterId)}/availability`,
  );

  return data.availability;
}

export async function createAvailability(slotDetails) {
  const data = await apiRequest("/availability", {
    method: "POST",
    body: JSON.stringify(slotDetails),
  });

  return data.availability;
}

export async function deleteAvailability(availabilityId) {
  return apiRequest(
    `/availability/${encodeURIComponent(availabilityId)}`,
    { method: "DELETE" },
  );
}