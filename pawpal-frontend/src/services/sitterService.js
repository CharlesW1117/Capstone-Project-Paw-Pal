import { apiRequest } from "./api";

function buildSitterQuery(filters) {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getSitters(filters = {}) {
  const data = await apiRequest(`/sitters${buildSitterQuery(filters)}`);
  return data.sitters;
}

export async function getSitterById(sitterId) {
  const data = await apiRequest(
    `/sitters/${encodeURIComponent(sitterId)}`,
  );

  return data.sitter;
}