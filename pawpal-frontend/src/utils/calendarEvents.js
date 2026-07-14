function parseDateParts(value) {
  const match = String(value || "").match(
    /^(\d{4})-(\d{2})-(\d{2})/,
  );

  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function parseTimeParts(value) {
  const match = String(value || "").match(/^(\d{2}):(\d{2})/);

  if (!match) {
    return null;
  }

  return {
    hours: Number(match[1]),
    minutes: Number(match[2]),
  };
}

export function parseApiDateTime(dateValue, timeValue) {
  const dateParts = parseDateParts(dateValue);
  const timeParts = parseTimeParts(timeValue);

  if (!dateParts || !timeParts) {
    return null;
  }

  const result = new Date(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
    timeParts.hours,
    timeParts.minutes,
  );

  const isValid =
    !Number.isNaN(result.getTime()) &&
    result.getFullYear() === dateParts.year &&
    result.getMonth() === dateParts.month - 1 &&
    result.getDate() === dateParts.day &&
    result.getHours() === timeParts.hours &&
    result.getMinutes() === timeParts.minutes;

  return isValid ? result : null;
}

function createAvailabilityEvent(slot) {
  const start = parseApiDateTime(slot.date, slot.startTime);
  const end = parseApiDateTime(slot.date, slot.endTime);

  if (!start || !end || end <= start) {
    return null;
  }

  return {
    id: `availability-${slot.id}`,
    title: "Available",
    start,
    end,
    allDay: false,
    resource: {
      type: "availability",
      status: "available",
      sitterId: slot.sitterId,
      availability: slot,
    },
  };
}

function createBookingTitle(booking) {
  const titleParts = [
    booking.serviceName,
    booking.petName,
  ].filter(Boolean);

  return titleParts.length > 0
    ? titleParts.join(" - ")
    : "Pet care booking";
}

function createBookingEvent(booking) {
  const start = parseApiDateTime(
    booking.date,
    booking.startTime,
  );

  const end = parseApiDateTime(
    booking.date,
    booking.endTime,
  );

  if (!start || !end || end <= start) {
    return null;
  }

  const status = String(booking.status || "pending").toLowerCase();

  return {
    id: `booking-${booking.id}`,
    title: createBookingTitle(booking),
    start,
    end,
    allDay: false,
    resource: {
      type: "booking",
      status,
      booking,
    },
  };
}

export function createAvailabilityEvents(availability = []) {
  return availability
    .map(createAvailabilityEvent)
    .filter(Boolean);
}

export function createBookingEvents(bookings = []) {
  return bookings
    .map(createBookingEvent)
    .filter(Boolean);
}

export function buildCalendarEvents({
  availability = [],
  bookings = [],
} = {}) {
  return [
    ...createAvailabilityEvents(availability),
    ...createBookingEvents(bookings),
  ].sort((firstEvent, secondEvent) => {
    return firstEvent.start.getTime() - secondEvent.start.getTime();
  });
}

export function getBookingStatusLabel(status) {
  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    declined: "Declined",
    cancelled: "Cancelled",
    completed: "Completed",
  };

  return labels[status] || "Booking";
}