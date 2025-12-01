import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// PÁGINAS PÚBLICAS
import LandingPage from "../features/home/pages/LandingPage";
import ProductsPage from "../features/home/pages/ProductsPage";
import ServicesPage from "../features/home/pages/ServicesPage";
import Login from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";
import ForgotPassword from "../features/auth/components/ForgotPassword";

// LAYOUT DEL DASHBOARD
import OpticaDashboardLayout from "../shared/components/layouts/OpticaDashboardLayout";

// CONSTANTES TEMPORALES (si no existe el archivo roles)
const ROLES = {
  ADMIN: 'admin',
  DEMO: 'demo', 
  VENDEDOR: 'vendedor',
  OPTICO: 'optico'
};

// COMPONENTE PROTECTED ROUTE SIMPLIFICADO
function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

// ESTE ES EL COMPONENTE PRINCIPAL DE RUTAS
export default function AppRoutes({ user, setUser, onLogin, onLogout }) {
  const navigate = useNavigate();

  // ESTE EFFECT REDIRIGE AL DASHBOARD SI EL USUARIO YA ESTÁ LOGUEADO
  useEffect(() => {
    if (user && window.location.pathname === "/login") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <Routes>
      
      {/* ✅ RUTA PRINCIPAL - NUEVA LANDING PAGE */}
      <Route
        path="/"
        element={
          <LandingPage
            user={user}
            setUser={setUser}
          />
        }
      />

      {/* ✅ NUEVAS RUTAS DEL LANDING PAGE */}
      <Route
        path="/productos"
        element={<ProductsPage />}
      />

      <Route
        path="/servicios"
        element={<ServicesPage />}
      />

      {/* ✅ RUTA DEL LOGIN */}
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

      {/* ✅ RUTA DEL REGISTRO */}
      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Register />
          )
        }
      />

      {/* ✅ RUTA DE RECUPERACIÓN DE CONTRASEÑA */}
      <Route
        path="/forgot-password"
        element={
          user ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <ForgotPassword />
          )
        }
      />

      {/* ✅ RUTAS PROTEGIDAS DEL ADMIN */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute user={user}>
            <OpticaDashboardLayout
              user={user}
              setUser={setUser}
            />
          </ProtectedRoute>
        }
      />

      {/* ✅ RUTA PARA MANTENER COMPATIBILIDAD CON HOME ANTIGUO */}
      <Route 
        path="/home" 
        element={
          user ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />

      {/* ✅ RUTA 404 MEJORADA */}
      <Route 
        path="*" 
        element={
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)'
          }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#1e293b' }}>404</h1>
            <h2 style={{ marginBottom: '1rem', color: '#334155' }}>Página no encontrada</h2>
            <p style={{ marginBottom: '2rem', color: '#64748b' }}>
              La página que buscas no existe en el sistema.
            </p>
            <button 
              onClick={() => window.history.back()}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Volver atrás
            </button>
          </div>
        } 
      />
    </Routes>
  );
}