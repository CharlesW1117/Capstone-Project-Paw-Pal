import { apiRequest } from "./api";

export async function getServices() {
  const data = await apiRequest("/services");
  return data.services;
}