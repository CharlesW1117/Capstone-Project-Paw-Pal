import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pets from "./pages/Pets";
import Book from "./pages/Book";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import Reviews from "./pages/Reviews";
import HomePage from "./pages/HomePage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <Navbar onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <Routes>
        {/* 👇 Default route opens homepage */}
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/homepage" element={<HomePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/book" element={<Book />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </Router>
  );
}

export default App;
