import { Navigate, useLocation } from "react-router-dom";
import { getCurrentSession } from "../services/authServices.js";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const session = getCurrentSession();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (
    Array.isArray(allowedRoles) &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(session.role)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
