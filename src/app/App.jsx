import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../features/home/pages/LandingPage";
import ProductsPage from "../features/home/pages/ProductsPage";
import ServicesPage from "../features/home/pages/ServicesPage";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import OpticaDashboardLayout from "../shared/components/layouts/OpticaDashboardLayout";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import authServices from "../features/auth/services/authServices";
import Configuration from "@configuracion/pages/Configuration";

export default function App() {
  const [user, setUser] = useState(() => authServices.getUser());

  const handleLogout = () => {
    authServices.logout();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* ========== RUTAS PÚBLICAS ========== */}
        <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
        <Route path="/productos" element={<ProductsPage user={user} setUser={setUser} />} />
        <Route path="/servicios" element={<ServicesPage user={user} setUser={setUser} />} />

        {/* ========== RUTAS DE AUTENTICACIÓN ========== */}
        <Route
          path="/login"
          element={
            user
              ? authServices.hasPermission(user, "dashboard")
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

        {/* ========== RUTA DE PERFIL / CONFIGURACIÓN ========== */}
        {/* Cualquier usuario autenticado puede acceder (sin permiso dashboard) */}
        <Route
          path="/cliente/perfil"
          element={
            <ProtectedRoute>
              <Configuration user={user} onUserUpdate={setUser} />
            </ProtectedRoute>
          }
        />

        {/* ========== RUTAS DEL DASHBOARD ========== */}
        {/* Requieren permiso "dashboard" */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute permiso="dashboard">
              <OpticaDashboardLayout user={user} setUser={setUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* ========== REDIRECCIÓN 404 ========== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}