import { apiRequest } from "./api";

export async function getSitterAvailability(sitterId) {
  const data = await apiRequest(
    `/sitters/${encodeURIComponent(sitterId)}/availability`,
  );

  return data.availability;
}