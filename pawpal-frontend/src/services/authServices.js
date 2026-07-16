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
      localStorage.removeItem("token");
      return null;
    }

    return {
      token,
      id: decoded.id || decoded.userId,
      role: decoded.role,
    };
  } catch {
    localStorage.removeItem("token");
    return null;
  }
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
