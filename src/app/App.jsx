/**
 * Componente principal de enrutamiento.
 * - Las rutas públicas (landing, productos, servicios) no requieren token.
 * - Las rutas de autenticación (/login, /register, /forgot-password) redirigen si ya hay sesión.
 * - La ruta /cliente/perfil solo requiere autenticación (sin permiso adicional).
 * - Las rutas bajo /admin/* requieren AL MENOS UNO de los permisos administrativos listados.
 * - Si el usuario tiene algún permiso administrativo pero no "ver_dashboard", 
 *   se le redirige al primer módulo disponible (ver lógica en OpticaDashboardLayout).
 * - Cualquier ruta no existente redirige a la landing.
 * - Se rehidrata la sesión al cargar la app usando el token almacenado.
 */

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../features/home/pages/LandingPage";
import ProductsPage from "../features/home/pages/ProductsPage";
import ServicesPage from "../features/home/pages/ServicesPage";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import OpticaDashboardLayout from "@shared/components/layouts/OpticaDashboardLayout";
import ProtectedRoute from "@shared/components/ProtectedRoute";
import authServices from "@auth/services/authServices";
import Configuration from "@configuracion/pages/Configuration";

// Lista de todos los permisos que permiten acceso al panel administrativo
const ADMIN_PERMISOS = [
  "ver_dashboard",
  "ver_ventas",
  "ver_clientes",
  "ver_pedidos",
  "ver_compras",
  "ver_productos",
  "ver_citas",
  "ver_empleados",
  "ver_proveedores",
  "ver_usuarios",
  "gestionar_configuracion"
];

// Función auxiliar para obtener el primer permiso administrativo que tiene el usuario
const getFirstAdminPermiso = (user) => {
  if (!user || !user.permisos) return null;
  return ADMIN_PERMISOS.find(permiso => user.permisos.includes(permiso)) || null;
};

export default function App() {
  const [user, setUser] = useState(() => authServices?.getUser?.() ?? null);

  // Rehidratar sesión al cargar la app
  useEffect(() => {
    const rehydrate = async () => {
      const token = authServices.getToken();
      if (token && !user) {
        const usuario = await authServices.getMe();
        if (usuario) {
          setUser(usuario);
        } else {
          authServices.logout();
          setUser(null);
        }
      }
    };
    rehydrate();
  }, []);

  const handleLogout = () => {
    authServices.logout();
    setUser(null);
  };

  // Determinar ruta de redirección después del login
  const getLoginRedirect = () => {
    if (!user) return "/productos";
    const firstPermiso = getFirstAdminPermiso(user);
    if (firstPermiso) {
      // Tiene algún permiso administrativo → va al área admin
      return "/admin";
    }
    return "/productos";
  };

  return (
    <Router>
      <Routes>
        {/* ========== RUTAS PÚBLICAS ========== */}
        <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
        <Route path="/productos/*" element={<ProductsPage user={user} setUser={setUser} />} />
        <Route path="/servicios" element={<ServicesPage user={user} setUser={setUser} />} />

        {/* ========== RUTAS DE AUTENTICACIÓN ========== */}
        <Route
          path="/login"
          element={
            user ? <Navigate to={getLoginRedirect()} replace /> : <Login key="login-page" setUser={setUser} />
          }
        />
        <Route
          path="/register"
          element={user ? <Navigate to={getLoginRedirect()} replace /> : <Register />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to={getLoginRedirect()} replace /> : <ForgotPassword />}
        />

        {/* ========== RUTA DE PERFIL / CONFIGURACIÓN ========== */}
        <Route
          path="/cliente/perfil"
          element={
            <ProtectedRoute>
              <Configuration user={user} onUserUpdate={setUser} />
            </ProtectedRoute>
          }
        />

        {/* ========== RUTAS DEL DASHBOARD (ADMIN) ========== */}
        {/* Requiere AL MENOS UNO de los permisos administrativos */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute permiso={ADMIN_PERMISOS}>
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
