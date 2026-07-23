import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authServices.js";
import { getCurrentUser } from "../services/userService.js";
import OwnerDashboard from "./OwnerDashboard.jsx";
import SitterDashboard from "./SitterDashboard.jsx";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const userData = await getCurrentUser();

        if (!cancelled) {
          setUser(userData);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error?.status === 401) {
          logoutUser();
          navigate("/login", { replace: true });
          return;
        }

        setLoadError(error.message || "Unable to load your dashboard.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <main className="dashboard-main">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  if (loadError || !user) {
    return (
      <main className="dashboard-main">
        <p role="alert">{loadError || "Unable to load your dashboard."}</p>
      </main>
    );
  }

  return user.role === "sitter" ? <SitterDashboard /> : <OwnerDashboard />;
}
