// =============================================================
// RESPONSABILIDAD: Lógica pura de la página de inicio.
//   - Navegación y scroll
//   - Verificación de permisos desde el JWT (ahora con hasAdminAccess)
//   - Handlers de sesión (login / logout / dashboard / perfil)
//   - Delega todo lo visual a AuthHome
// =============================================================

import { useNavigate } from "react-router-dom";
import AuthHome from "./AuthHome";
import authServices from "@auth/Services/authServices";

// ------------------------------------------------------------------
// LandingPage
// Calcula permisos y expone handlers — no tiene JSX propio.
// ------------------------------------------------------------------
const LandingPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  // --- Permisos: ¿puede ver el botón de Dashboard? ---
  const showDashboard = user ? authServices.hasAdminAccess(user) : false;

  // --- Handlers ---
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleLogin = () => navigate("/login");
  
  const handleLogout = () => { 
    authServices.logout();
    setUser(null); 
    navigate("/"); 
  };

  const handleDashboard = () => navigate("/admin");  // ← redirige a /admin (redirección inteligente)

  const handleMiPerfil = () => navigate("/cliente/perfil");

  return (
    <AuthHome
      user={user}
      showDashboard={showDashboard}
      onNavigation={handleNavigation}
      onLogin={handleLogin}
      onLogout={handleLogout}
      onDashboard={handleDashboard}
      onMiPerfil={handleMiPerfil}
    />
  );
};

export default LandingPage;