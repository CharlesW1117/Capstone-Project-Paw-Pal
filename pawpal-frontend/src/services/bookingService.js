import { apiRequest } from "./api";

export async function getBookings() {
  const data = await apiRequest("/bookings");
  return data.bookings;
}

export async function createBooking(bookingDetails) {
  const data = await apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingDetails),
  });

  return data.booking;
}

export async function updateBookingStatus(bookingId, status) {
  const data = await apiRequest(
    `/bookings/${encodeURIComponent(bookingId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );

  return data.booking;
}

export async function getBackupSitters(bookingId) {
  const data = await apiRequest(
    `/bookings/${encodeURIComponent(bookingId)}/backup-sitters`,
  );

  return data.backupSitters;
}