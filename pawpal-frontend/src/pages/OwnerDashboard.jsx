import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPets } from "../services/petservice.js";
import { getBookings } from "../services/bookingService.js";
import { getConversations } from "../services/messageService.js";
import { getCurrentUser } from "../services/userService.js";

export default function OwnerDashboard() {
  const [pets, setPets] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadPets() {
      try {
        const petsData = await getPets();
        setPets(petsData);
      } catch (error) {
        console.error("Could not load pets:", error);
      }
    }

    loadPets();
  }, []);

  useEffect(() => {
    async function loadBookings() {
      try {
        const bookingData = await getBookings();
        setUpcomingBookings(bookingData);
      } catch (error) {
        console.error("Could not load bookings:", error);
      }
    }

    loadBookings();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      try {
        const conversationData = await getConversations();
        setRecentMessages(conversationData);
      } catch (error) {
        console.error("Could not load messages:", error);
      }
    }

    loadMessages();
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Could not load user:", error);
      }
    }

    loadUser();
  }, []);

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-label">Pet Owner Dashboard</p>
          <h1>Welcome Back{user?.name ? `, ${user.name}` : ""}!</h1>
          <p>Manage your pets and upcoming bookings.</p>
        </div>
        <Link to="/book" className="sitter-btn">
          Find a Sitter
        </Link>
      </header>

      <section className="dashboard-summary">
        <article className="summary-card">
          <p>Pets</p>
          <h2>{pets.length}</h2>
        </article>

        <article className="summary-card">
          <p>Upcoming Bookings</p>
          <h2>{upcomingBookings.length}</h2>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>My Pets</h2>

          <Link to="/pets" className="add-pet-btn">
            Add a Pet
          </Link>
        </div>

        <div className="pet-grid">
          {pets.length === 0 ? (
            <article className="empty-card">
              <h3>No pets added yet</h3>
              <p>Your pets will appear here after you add them.</p>
            </article>
          ) : (
            pets.map((pet) => (
              <article className="pet-card" key={pet.id}>
                <h3>{pet.name}</h3>
                <p>{pet.species}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Booking Status</h2>
        {upcomingBookings.length === 0 ? (
          <article className="empty-card">
            <h3>No bookings yet</h3>
            <p>Your bookings will appear here after you receive them.</p>
          </article>
        ) : (
          upcomingBookings.map((booking) => (
            <article className="booking-card" key={booking.id}>
              <div>
                <h3>
                  {booking.serviceName} for {booking.petName}
                </h3>

                <p>
                  {booking.date} at {booking.startTime}
                </p>

                <p>Sitter: {booking.sitterName}</p>
              </div>

              <span className="booking-status">{booking.status}</span>
            </article>
          ))
        )}
      </section>

      <section className="dashboard-section">
        <h2>Recent Messages</h2>

        {recentMessages.length === 0 ? (
          <article className="empty-card">
            <h3>No new messages yet</h3>
            <p>Your messages will appear here after you receive them.</p>
          </article>
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