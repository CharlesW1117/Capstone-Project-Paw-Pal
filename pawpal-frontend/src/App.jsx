import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
