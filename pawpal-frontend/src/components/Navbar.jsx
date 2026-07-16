import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Navbar.css";

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ✅ Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".menu-toggle")
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <nav className="navbar">
      <button className="menu-toggle" onClick={handleToggleSidebar}>
        ☰
      </button>

      <NavLink to="/homepage" className="navbar-logo">
        🐾 PawPal
      </NavLink>

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

      <button className="login-btn">Login</button>

      {/* 👇 Pass ref to Sidebar */}
      <Sidebar isOpen={isSidebarOpen} sidebarRef={sidebarRef} />
    </nav>
  );
}

export default Navbar;
