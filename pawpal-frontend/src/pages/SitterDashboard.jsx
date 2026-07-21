import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookings } from "../services/bookingService.js";
import { getConversations } from "../services/messageService.js";
import { getCurrentUser } from "../services/userService.js";

export default function SitterDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [userData, bookingData, conversationData] = await Promise.all([
          getCurrentUser(),
          getBookings(),
          getConversations(),
        ]);

        setUser(userData);
        setBookings(Array.isArray(bookingData) ? bookingData : []);
        setRecentMessages(
          Array.isArray(conversationData) ? conversationData : [],
        );
      } catch (error) {
        console.error("Could not load sitter dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const pendingRequests = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "pending",
  );

  const upcomingBookings = bookings.filter((booking) =>
    ["accepted", "confirmed"].includes(booking.status?.toLowerCase()),
  );

  if (isLoading) {
    return (
      <main className="dashboard-main">
        <p className="empty-message">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-label">Pet Sitter Dashboard</p>

          <h1>Welcome Back{user?.name ? `, ${user.name}` : ""}!</h1>

          <p>Manage your booking requests and upcoming pet-care jobs.</p>
        </div>

        <Link to="/profile" className="sitter-btn">
          View Profile
        </Link>
      </header>

      <section className="dashboard-summary sitter-summary">
        <article className="summary-card">
          <p>Pending Requests</p>
          <h2>{pendingRequests.length}</h2>
        </article>

        <article className="summary-card">
          <p>Upcoming Jobs</p>
          <h2>{upcomingBookings.length}</h2>
        </article>

        <article className="summary-card">
          <p>Recent Messages</p>
          <h2>{recentMessages.length}</h2>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Pending Requests</h2>

          <Link to="/book" className="dashboard-link-btn">
            View All
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="empty-dashboard-card">
            <h3>No pending requests</h3>
            <p>New booking requests will appear here.</p>
          </div>
        ) : (
          <div className="dashboard-card-list">
            {pendingRequests.map((booking) => (
              <article className="booking-card" key={booking.id}>
                <div>
                  <h3>
                    {booking.serviceName || "Pet Care"} for{" "}
                    {booking.petName || "Pet"}
                  </h3>

                  <p>
                    {booking.date || "Date unavailable"}
                    {booking.startTime && ` at ${booking.startTime}`}
                  </p>

                  <p>
                    Owner:{" "}
                    {booking.ownerName || "Owner information unavailable"}
                  </p>
                </div>

                <div className="booking-actions">
                  <Link
                    to={`/bookings/${booking.id}`}
                    className="secondary-dashboard-btn"
                  >
                    View Request
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Upcoming Jobs</h2>

        {upcomingBookings.length === 0 ? (
          <div className="empty-dashboard-card">
            <h3>No upcoming jobs</h3>
            <p>Your accepted bookings will appear here.</p>
          </div>
        ) : (
          <div className="dashboard-card-list">
            {upcomingBookings.map((booking) => (
              <article className="booking-card" key={booking.id}>
                <div>
                  <h3>
                    {booking.serviceName || "Pet Care"} for{" "}
                    {booking.petName || "Pet"}
                  </h3>

                  <p>
                    {booking.date || "Date unavailable"}
                    {booking.startTime && ` at ${booking.startTime}`}
                  </p>

                  <p>
                    Owner:{" "}
                    {booking.ownerName || "Owner information unavailable"}
                  </p>
                </div>

                <span className="booking-status">
                  {booking.status || "Confirmed"}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Messages</h2>

          <Link to="/messages" className="dashboard-link-btn">
            View Messages
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="empty-dashboard-card">
            <h3>No recent messages</h3>
            <p>Your conversations with pet owners will appear here.</p>
          </div>
        ) : (
          recentMessages.slice(0, 3).map((conversation) => (
            <article className="message-card" key={conversation.bookingId}>
              <div>
                <h3>{conversation.participantName}</h3>
                <p>{conversation.bookingLabel}</p>
                <p>{conversation.lastMessage || "No messages yet"}</p>
              </div>

              {conversation.unreadCount > 0 && (
                <span className="unread-count">{conversation.unreadCount}</span>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}