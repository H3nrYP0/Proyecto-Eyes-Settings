import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "/src/shared/styles/globals/app.css";
import "/src/shared/styles/globals/reset.css";
import "/src/shared/styles/globals/variables.css";

import LandingPage from "../features/home/pages/LandingPage";
import ProductsPage from "../features/home/pages/ProductsPage";
import ServicesPage from "../features/home/pages/ServicesPage";
import Login from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";
import ForgotPassword from "../features/auth/components/ForgotPassword";
import OpticaDashboardLayout from "../shared/components/layouts/OpticaDashboardLayout";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import authService from "../features/auth/Services/authService";

export default function App() {
  // ── Inicializar user directamente desde localStorage ──
  // Evita el flash de null antes del useEffect
  const [user, setUser] = useState(() => authService.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
        color: "white"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👁️</div>
          <h2>Visual Outlet</h2>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
        <Route path="/productos" element={<ProductsPage user={user} setUser={setUser} />} />
        <Route path="/servicios" element={<ServicesPage user={user} setUser={setUser} />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/admin/dashboard" replace /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/admin/dashboard" replace /> : <Register />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/admin/dashboard" replace /> : <ForgotPassword />}
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute permiso="dashboard">
              <OpticaDashboardLayout />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}