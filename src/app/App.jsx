import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../features/home/pages/LandingPage";
import ProductsPage from "../features/home/pages/ProductsPage";
import ServicesPage from "../features/home/pages/ServicesPage";
import Login from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";
import ForgotPassword from "../features/auth/components/ForgotPassword";
import OpticaDashboardLayout from "../shared/components/layouts/OpticaDashboardLayout";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import authService from "../features/auth/services/authService";

export default function App() {
  const [user, setUser] = useState(() => authService.getUser());

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
        <Route path="/productos" element={<ProductsPage user={user} setUser={setUser} />} />
        <Route path="/servicios" element={<ServicesPage user={user} setUser={setUser} />} />

        <Route
          path="/login"
          element={
            user
              ? authService.hasPermission(user, "dashboard")
                ? <Navigate to="/admin/dashboard" replace />
                : <Navigate to="/productos" replace />
              : <Login key="login-page" setUser={setUser} /> 
          }
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/productos" replace /> : <Register />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/productos" replace /> : <ForgotPassword />}
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute permiso="dashboard">
              <OpticaDashboardLayout user={user} setUser={setUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}