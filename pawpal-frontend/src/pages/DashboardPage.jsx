import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/userService.js";
import OwnerDashboard from "./OwnerDashboard.jsx";
import SitterDashboard from "./SitterDashboard.jsx";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Could not load user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  if (isLoading) {
    return (
      <main className="dashboard-main">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  if (user?.role === "sitter") {
    return <SitterDashboard />;
  }

  return <OwnerDashboard />;
}