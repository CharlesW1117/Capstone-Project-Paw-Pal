import { NavLink } from "react-router-dom";
import { getCurrentSession } from "../services/authServices.js";
import "./Sidebar.css";

function Sidebar({ isOpen, sidebarRef, onClose }) {
  const session = getCurrentSession();
  const isOwner = session?.role === "owner";
  const isSitter = session?.role === "sitter";

  function handleLinkClick() {
    onClose?.();
  }

  if (!session) {
    return null;
  }

  return (
    <aside ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <li>
          <NavLink to="/dashboard" onClick={handleLinkClick}>
            Dashboard
          </NavLink>
        </li>

        {isOwner && (
          <>
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
              <NavLink to="/reviews" onClick={handleLinkClick}>
                Reviews
              </NavLink>
            </li>
            <li>
              <NavLink to="/owner-profile" onClick={handleLinkClick}>
                Profile
              </NavLink>
            </li>
          </>
        )}

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

        {isSitter && (
          <li>
            <NavLink to="/sitter-settings" onClick={handleLinkClick}>
              My Services
            </NavLink>
          </li>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
