const configuredApiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const API_URL = configuredApiUrl.replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${API_URL}${normalizedPath}`, {
    ...options,
    headers,
  });

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && data.error
        ? data.error
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data;
}
