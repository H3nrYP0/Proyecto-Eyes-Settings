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
// =============================================================

import { Tooltip } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = ({
  user,
  activePage,
  puedeVerDashboard,
  onNavigation,
  onLogin,
  onLogout,
  onDashboard,
}) => {
  const userName = user?.name ?? user?.nombre ?? "";

  return (
    <nav className="landing-nav">
      <div className="nav-container">

        {/* Marca */}
        <div className="nav-brand">
          <span className="logo-text">VISUAL OUTLET</span>
        </div>

        {/* Links — active se aplica según activePage */}
        <div className="nav-menu">
          <button
            className={`nav-link ${activePage === "inicio" ? "active" : ""}`}
            onClick={() => onNavigation("/")}
          >
            Inicio
          </button>
          <button
            className={`nav-link ${activePage === "productos" ? "active" : ""}`}
            onClick={() => onNavigation("/productos")}
          >
            Productos
          </button>
          <button
            className={`nav-link ${activePage === "servicios" ? "active" : ""}`}
            onClick={() => onNavigation("/servicios")}
          >
            Servicios
          </button>
        </div>

        {/* Acciones según sesión */}
        <div className="nav-actions">
          {user ? (
            <div className="user-actions">

              {/* Icono estándar de usuario MUI */}
              <Tooltip title={userName} arrow>
                <AccountCircleIcon
                  sx={{
                    fontSize: 36,
                    color: "rgba(255,255,255,0.85)",
                    cursor: "default",
                  }}
                />
              </Tooltip>

              <span className="user-greeting">Hola, {userName}</span>

              {/* Solo visible si tiene permiso "dashboard" en el JWT */}
              {puedeVerDashboard && (
                <button className="btn btn-dashboard" onClick={onDashboard}>
                  Dashboard
                </button>
              )}

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