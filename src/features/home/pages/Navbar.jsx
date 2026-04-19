// =============================================================
// Navbar.jsx
// RESPONSABILIDAD: Barra de navegación compartida entre todas
//   las páginas públicas (Inicio, Productos, Servicios).
//
//   - Muestra icono de usuario + nombre si hay sesión activa
//   - Muestra botón Dashboard solo si tiene permiso "dashboard"
//   - Resalta el link activo según la prop `activePage`
//   - NO contiene lógica de permisos — recibe todo por props
//
// PROPS:
//   user               — objeto usuario del JWT (o null)
//   activePage         — "inicio" | "productos" | "servicios"
//   puedeVerDashboard  — boolean calculado en el padre
//   onNavigation(path) — navega con scroll top
//   onLogin()          — redirige al login
//   onLogout()         — cierra sesión
//   onDashboard()      — redirige al dashboard
//   onMiPerfil()       — redirige al perfil de usuario
// =============================================================

import { Tooltip, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const Navbar = ({
  user,
  activePage,
  puedeVerDashboard,
  onNavigation,
  onLogin,
  onLogout,
  onDashboard,
  onMiPerfil,
}) => {
  const userName = user?.name ?? user?.nombre ?? "";

  // Handlers para evitar funciones anónimas en el render
  const handleNavigationHome = () => onNavigation("/");
  const handleNavigationProducts = () => onNavigation("/productos");
  const handleNavigationServices = () => onNavigation("/servicios");
  const handleMiPerfilClick = () => onMiPerfil?.();

  return (
    <nav className="landing-nav">
      <div className="nav-container">

        {/* Marca */}
        <div className="nav-brand">
          <span className="logo-text">VISUAL OUTLET</span>
        </div>

        {/* Links de navegación */}
        <div className="nav-menu">
          <button
            className={`nav-link ${activePage === "inicio" ? "active" : ""}`}
            onClick={handleNavigationHome}
          >
            Inicio
          </button>
          <button
            className={`nav-link ${activePage === "productos" ? "active" : ""}`}
            onClick={handleNavigationProducts}
          >
            Productos
          </button>
          <button
            className={`nav-link ${activePage === "servicios" ? "active" : ""}`}
            onClick={handleNavigationServices}
          >
            Servicios
          </button>
        </div>

        {/* Acciones según sesión */}
        <div className="nav-actions">
          {user ? (
            <div className="user-actions">
              {/* Icono de perfil */}
              <Tooltip title="Mi Perfil" arrow>
                <IconButton onClick={handleMiPerfilClick} sx={{ p: 0 }}>
                  <PersonIcon
                    sx={{
                      fontSize: 32,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  />
                </IconButton>
              </Tooltip>

              {/* Saludo al usuario */}
              <span className="user-greeting">Hola, {userName}</span>

              {/* Botón Dashboard (solo si tiene permiso) */}
              {puedeVerDashboard && (
                <button className="btn btn-dashboard" onClick={onDashboard}>
                  Dashboard
                </button>
              )}

              {/* Botón de cierre de sesión */}
              <button className="btn btn-logout" onClick={onLogout}>
                Salir
              </button>
            </div>
          ) : (
            <button className="btn btn-login" onClick={onLogin}>
              Iniciar sesión
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;