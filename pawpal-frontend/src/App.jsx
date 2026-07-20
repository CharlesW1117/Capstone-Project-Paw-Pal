import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPasswordPage";
import ResetPassword from "./pages/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import Pets from "./pages/Pets";
import Book from "./pages/Book";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import Reviews from "./pages/Reviews";
import HomePage from "./pages/HomePage";
import Sitters from "./pages/Sitters";
import OwnerProfile from "./pages/OwnerProfile";
import SitterSettings from "./pages/SitterSettings";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Redirect root to homepage */}
        <Route path="/" element={<Navigate to="/homepage" replace />} />
        {/* Public routes */}
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/sitters" element={<Sitters />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pets"
          element={
            <ProtectedRoute>
              <Pets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <Book />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner-profile"
          element={
            <ProtectedRoute>
              <OwnerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sitter-settings"
          element={
            <ProtectedRoute>
              <SitterSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          }
        />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/homepage" replace />} />
      </Routes>
    </Router>
  );
}
export default App;