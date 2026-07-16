import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ isOpen, sidebarRef, onClose }) {
  // ✅ Close sidebar when a link is clicked
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <li>
          <NavLink to="/dashboard" onClick={handleLinkClick}>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/pets" onClick={handleLinkClick}>
            Pets
          </NavLink>
        </li>

        <li>
          <NavLink to="/book" onClick={handleLinkClick}>
            Book
          </NavLink>
        </li>

        <li>
          <NavLink to="/calendar" onClick={handleLinkClick}>
            Calendar
          </NavLink>
        </li>

        <li>
          <NavLink to="/messages" onClick={handleLinkClick}>
            Messages
          </NavLink>
        </li>

        <li>
          <NavLink to="/reviews" onClick={handleLinkClick}>
            Reviews
          </NavLink>
        </li>

        {/* 🐾 New Profile link */}
        <li>
          <NavLink to="/owner-profile" onClick={handleLinkClick}>
            Profile
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
