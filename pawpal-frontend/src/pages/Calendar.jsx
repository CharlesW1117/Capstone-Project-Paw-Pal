import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
} from "react-big-calendar";
import {
  format,
  getDay,
  parse,
  startOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import CalendarEventDetails from "../components/calendar/CalendarEventDetails";
import CalendarLegend from "../components/calendar/CalendarLegend";
import Modal from "../components/Modal";
import { getSitterAvailability } from "../services/availabilityService";
import { getCurrentSession } from "../services/authServices";
import { getBookings } from "../services/bookingService";
import { getSitters } from "../services/sitterService";
import { buildCalendarEvents } from "../utils/calendarEvents";
import "./Calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    "en-US": enUS,
  },
});

function Calendar() {
  const session = useMemo(() => getCurrentSession(), []);

  const [sitters, setSitters] = useState([]);
  const [selectedSitterId, setSelectedSitterId] = useState("");
  const [isLoadingSitters, setIsLoadingSitters] = useState(false);
  const [sittersError, setSittersError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  const [availability, setAvailability] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] =
    useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const [selectedEvent, setSelectedEvent] = useState(null);

  const availabilitySitterId =
    session?.role === "sitter"
      ? session.id
      : selectedSitterId;

  const selectedSitter = sitters.find(
    (sitter) => String(sitter.id) === String(selectedSitterId),
  );

  const events = useMemo(
    () =>
      buildCalendarEvents({
        availability,
        bookings,
      }),
    [availability, bookings],
  );

  const loadBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    setBookingsError("");

    try {
      const bookingResults = await getBookings();
      setBookings(bookingResults);
    } catch (requestError) {
      setBookingsError(
        requestError.message || "Unable to load bookings.",
      );
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  const loadSitters = useCallback(async () => {
    if (session?.role !== "owner") {
      return;
    }

    setIsLoadingSitters(true);
    setSittersError("");

    try {
      const sitterResults = await getSitters();
      setSitters(sitterResults);

      setSelectedSitterId((currentId) => {
        if (currentId) {
          return currentId;
        }

        return sitterResults[0]
          ? String(sitterResults[0].id)
          : "";
      });
    } catch (requestError) {
      setSittersError(
        requestError.message || "Unable to load sitters.",
      );
    } finally {
      setIsLoadingSitters(false);
    }
  }, [session?.role]);

  const loadAvailability = useCallback(async () => {
    if (!availabilitySitterId) {
      setAvailability([]);
      setAvailabilityError("");
      return;
    }

    setIsLoadingAvailability(true);
    setAvailabilityError("");

    try {
      const availabilityResults =
        await getSitterAvailability(availabilitySitterId);

      setAvailability(availabilityResults);
    } catch (requestError) {
      setAvailability([]);
      setAvailabilityError(
        requestError.message || "Unable to load availability.",
      );
    } finally {
      setIsLoadingAvailability(false);
    }
  }, [availabilitySitterId]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    loadSitters();
  }, [loadSitters]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  function refreshCalendar() {
    loadBookings();
    loadAvailability();

    if (session?.role === "owner") {
      loadSitters();
    }
  }

  function getEventProps(event) {
    const status = event.resource?.status || "pending";

    return {
      className: `calendar-event calendar-event--${status}`,
    };
  }

  const isCalendarLoading =
    isLoadingBookings ||
    isLoadingAvailability ||
    isLoadingSitters;

  return (
    <main className="calendar-page main-content">
      <header className="calendar-page__header">
        <div>
          <p className="calendar-page__eyebrow">Schedule</p>
          <h1>Calendar</h1>
          <p>
            Review your bookings and compare open sitter availability.
          </p>
        </div>

        <button
          className="calendar-page__refresh"
          type="button"
          onClick={refreshCalendar}
          disabled={isCalendarLoading}
        >
          <i className="fi fi-rr-refresh" aria-hidden="true" />
          {isCalendarLoading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <section className="calendar-page__controls">
        {session?.role === "owner" ? (
          <div className="calendar-page__sitter-field">
            <label htmlFor="calendar-sitter">Sitter availability</label>

            <select
              id="calendar-sitter"
              value={selectedSitterId}
              onChange={(event) =>
                setSelectedSitterId(event.target.value)
              }
              disabled={isLoadingSitters || sitters.length === 0}
            >
              {sitters.length === 0 && (
                <option value="">No sitters available</option>
              )}

              {sitters.map((sitter) => (
                <option key={sitter.id} value={sitter.id}>
                  {sitter.name} - {sitter.city}, {sitter.state}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="calendar-page__sitter-summary">
            <i className="fi fi-rr-user" aria-hidden="true" />
            <div>
              <span>Sitter schedule</span>
              <strong>Your availability and bookings</strong>
            </div>
          </div>
        )}

        <CalendarLegend />
      </section>

      {sittersError && (
        <div className="calendar-page__error" role="alert">
          <p>{sittersError}</p>
        </div>
      )}

      {bookingsError && (
        <div className="calendar-page__error" role="alert">
          <p>{bookingsError}</p>
        </div>
      )}

      {availabilityError && (
        <div className="calendar-page__error" role="alert">
          <p>{availabilityError}</p>
        </div>
      )}

      <section
        className="calendar-page__calendar"
        aria-label="Availability and bookings calendar"
      >
        {isCalendarLoading && (
          <div className="calendar-page__loading" role="status">
            <span
              className="calendar-page__spinner"
              aria-hidden="true"
            />
            <span>Loading calendar...</span>
          </div>
        )}

        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month", "week", "day", "agenda"]}
          step={30}
          timeslots={2}
          popup
          showMultiDayTimes
          eventPropGetter={getEventProps}
          onSelectEvent={setSelectedEvent}
          messages={{
            today: "Today",
            previous: "Back",
            next: "Next",
          }}
        />
      </section>

      {!isCalendarLoading && events.length === 0 && (
        <div className="calendar-page__empty">
          <i className="fi fi-rr-calendar-xmark" aria-hidden="true" />
          <div>
            <h2>No calendar events</h2>
            <p>
              There are no bookings or open availability to display.
            </p>
          </div>
        </div>
      )}

      {selectedEvent && (
        <Modal
          title={
            selectedEvent.resource?.type === "availability"
              ? "Available time"
              : "Booking details"
          }
          onClose={() => setSelectedEvent(null)}
        >
          <CalendarEventDetails
            event={selectedEvent}
            sitterName={
              session?.role === "sitter"
                ? "You"
                : selectedSitter?.name
            }
          />
        </Modal>
      )}
    </main>
  );
}

export default Calendar;