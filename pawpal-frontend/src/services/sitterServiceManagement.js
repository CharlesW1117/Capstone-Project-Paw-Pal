import { apiRequest } from "./api";

export async function addMyService(serviceDetails) {
  const data = await apiRequest("/sitters/me/services", {
    method: "POST",
    body: JSON.stringify(serviceDetails),
  });

  return data.sitterService;
}

export async function updateMyService(sitterServiceId, priceOverride) {
  const data = await apiRequest(
    `/sitters/me/services/${encodeURIComponent(sitterServiceId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ priceOverride }),
    },
  );

  return data.sitterService;
}

export async function deleteMyService(sitterServiceId) {
  return apiRequest(
    `/sitters/me/services/${encodeURIComponent(sitterServiceId)}`,
    { method: "DELETE" },
  );
}

export async function submitBackgroundCheck() {
  const data = await apiRequest("/sitters/me/background-check", {
    method: "POST",
  });

  return data;
}
