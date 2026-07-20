import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ change this line

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const redirectToLogin = (
    <Navigate to="/login" replace state={{ from: location }} />
  );

  if (!token) {
    return redirectToLogin;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return redirectToLogin;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("token");
    return redirectToLogin;
  }
}

export default ProtectedRoute;
