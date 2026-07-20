import { apiRequest, API_URL } from "./api";

export async function getCurrentUser() {
  const data = await apiRequest("/users/me");
  return data.user;
}

export async function updateCurrentUser(profileDetails) {
  const data = await apiRequest("/users/me", {
    method: "PATCH",
    body: JSON.stringify(profileDetails),
  });

  return data.user;
}

export async function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);

  const data = await apiRequest("/users/me/photo", {
    method: "POST",
    body: formData,
  });

  return data.user;
}

export function getProfilePhotoUrl(userId) {
  return `${API_URL}/users/${encodeURIComponent(userId)}/photo`;
}
