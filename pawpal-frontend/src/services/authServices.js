import { jwtDecode } from "jwt-decode";
import { apiRequest } from "./api.js";

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function getCurrentSession() {
  const token = getStoredToken();

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime) {
      logoutUser();
      return null;
    }

    return {
      token,
      id: decoded.id || decoded.userId,
      role: decoded.role,
    };
  } catch {
    logoutUser();
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  localStorage.removeItem("pawPalToken");
  localStorage.removeItem("pawPalUser");
  localStorage.removeItem("pawPalLoggedIn");
}

export async function registerUser(formData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function loginUser(loginData) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
}

export async function requestPasswordReset(email) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token, password) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
