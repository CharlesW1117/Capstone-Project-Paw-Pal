import { apiRequest } from "./api";

export async function createReview(reviewDetails) {
  const data = await apiRequest("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewDetails),
  });

  return data.review;
}