import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar({ onToggleSidebar }) {
  return (
    <nav className="navbar">
      <button className="menu-toggle" onClick={onToggleSidebar}>
        ☰
      </button>
      <div className="navbar-logo">🐾 PawPal</div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/pets">Pets</NavLink>
        </li>
        <li>
          <NavLink to="/book">Book</NavLink>
        </li>
        <li>
          <NavLink to="/calendar">Calendar</NavLink>
        </li>
        <li>
          <NavLink to="/messages">Messages</NavLink>
        </li>
        <li>
          <NavLink to="/reviews">Reviews</NavLink>
        </li>
      </ul>
      <button className="logout-btn">Logout</button>
    </nav>
  );
}

export default Navbar;
