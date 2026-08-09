import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import { SignUp } from "../pages/auth/SignUp";
import { Login } from "../pages/auth/Login";
import LandingPage from "../pages/LandingPage";
import { AuthContext } from "../context/AuthContext";
import BoardRoom from "../pages/board/BoardRoom";


// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <Routes>

      {/* 🌍 Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* 🔐 Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/board/:id"
        element={
          <ProtectedRoute>
            <BoardRoom />
          </ProtectedRoute>
        }
      />

      {/* ❌ Fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}