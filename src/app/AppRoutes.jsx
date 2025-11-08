import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// ESTAS SON LAS PÁGINAS PRINCIPALES
import Home from "../features/home/pages/Home";
import Login from "../features/auth/pages/Login";
import OpticaDashboardLayout from "../shared/components/layouts/OpticaDashboardLayout";
import ProtectedRoute from "../shared/components/ProtectedRoute";

// ESTAS SON LAS CONSTANTES DE ROLES
import { ROLES } from "../shared/constants/roles";

// ESTE ES EL COMPONENTE PRINCIPAL DE RUTAS
export default function AppRoutes({ user, setUser, onLogin, onLogout }) {
  const navigate = useNavigate();

  // ESTA FUNCIÓN REDIRIGE AL LOGIN SIN RECARGAR
  const goToLogin = () => navigate("/login");

  // ESTE EFFECT REDIRIGE AL DASHBOARD SI EL USUARIO YA ESTÁ LOGUEADO
  useEffect(() => {
    if (user && window.location.pathname === "/login") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <Routes>
      
      {/* ESTA ES LA RUTA DE LA PÁGINA PRINCIPAL */}
      <Route
        path="/"
        element={
          <Home
            user={user}
            setUser={setUser}
            onLoginClick={goToLogin}
          />
        }
      />

      {/* ESTA ES LA RUTA DEL LOGIN */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Login setUser={onLogin} />
          )
        }
      />

      {/* ESTAS SON LAS RUTAS PROTEGIDAS DEL ADMIN */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute 
            user={user} 
            allowedRoles={[ROLES.ADMIN, ROLES.DEMO, ROLES.VENDEDOR, ROLES.OPTICO]}
          >
            <OpticaDashboardLayout
              user={user}
              setUser={setUser}
              onLogout={onLogout}
            />
          </ProtectedRoute>
        }
      />

      {/* ESTA ES LA RUTA POR DEFECTO (404) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}