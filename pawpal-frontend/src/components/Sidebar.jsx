import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
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
    </aside>
  );
}

export default Sidebar;
