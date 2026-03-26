// =============================================================
// LandingPage.jsx
// RESPONSABILIDAD: Lógica pura de la página de inicio.
//   - Navegación y scroll
//   - Verificación de permisos desde el JWT
//   - Handlers de sesión (login / logout / dashboard)
//   - Delega todo lo visual a AuthHome
// =============================================================

import { useNavigate } from "react-router-dom";
import AuthHome from "./AuthHome";
import { hasPermiso } from "../utils/permissions";

// ------------------------------------------------------------------
// LandingPage
// Calcula permisos y expone handlers — no tiene JSX propio.
// ------------------------------------------------------------------
const LandingPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  // --- Permisos derivados del JWT ---
  const puedeVerDashboard = hasPermiso(user, "dashboard");

  // --- Handlers ---
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleLogin = () => navigate("/login");
  const handleLogout = () => { 
    setUser(null); 
    navigate("/"); 
  };
  const handleDashboard = () => navigate(user ? "/admin/dashboard" : "/login");

  return (
    <AuthHome
      user={user}
      puedeVerDashboard={puedeVerDashboard}
      onNavigation={handleNavigation}
      onLogin={handleLogin}
      onLogout={handleLogout}
      onDashboard={handleDashboard}
    />
  );
};

export default LandingPage;