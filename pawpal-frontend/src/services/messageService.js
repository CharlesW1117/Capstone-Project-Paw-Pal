import { apiRequest } from "./api";

export async function getConversations() {
  const data = await apiRequest("/messages");
  return data.conversations;
}

export async function getBookingMessages(bookingId) {
  const data = await apiRequest(
    `/messages/${encodeURIComponent(bookingId)}`,
  );

  return data.messages;
}

export async function sendMessage(bookingId, body) {
  const data = await apiRequest("/messages", {
    method: "POST",
    body: JSON.stringify({
      bookingId,
      body,
    }),
  });

  return data.message;
}