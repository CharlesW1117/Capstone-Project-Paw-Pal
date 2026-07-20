import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getCurrentSession, logoutUser } from "../services/authServices.js";
import "./Navbar.css";

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const session = getCurrentSession();

  function handleToggleSidebar() {
    setIsSidebarOpen((current) => !current);
  }

  function handleLogout() {
    logoutUser();
    setIsSidebarOpen(false);
    navigate("/login");
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".menu-toggle")
      ) {
        setIsSidebarOpen(false);
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          {session && (
            <button
              type="button"
              className="menu-toggle"
              onClick={handleToggleSidebar}
              aria-label="Open sidebar"
            >
              ☰
            </button>
          )}

          <NavLink to="/homepage" className="navbar-logo">
            🐾 PawPal
          </NavLink>
        </div>

        <div className="navbar-right">
          {session ? (
            <>
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

              <button
                type="button"
                className="navbar-auth-link"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <ul className="navbar-links">
              <li>
                <NavLink to="/login">Log In</NavLink>
              </li>

              <li>
                <NavLink to="/register">Register</NavLink>
              </li>
            </ul>
          )}
        </div>
      </nav>

      <Sidebar
        isOpen={isSidebarOpen}
        sidebarRef={sidebarRef}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}

export default Navbar;
