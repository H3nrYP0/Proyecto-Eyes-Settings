// =============================================================
// Navbar.jsx — Con iconos de carrito y wishlist
// =============================================================

import { Tooltip, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useCart } from "../../home/components/Products/ShoppingCart";

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
  const { cartCount, toggleCart, wishCount, openWishlist } = useCart();

  return (
    <nav className="landing-nav">
      <div className="nav-container">

        {/* Marca */}
        <div className="nav-brand">
          <span className="logo-text">VISUAL OUTLET</span>
        </div>

        {/* Links */}
        <div className="nav-menu">
          <button className={`nav-link ${activePage === "inicio" ? "active" : ""}`} onClick={() => onNavigation("/")}>Inicio</button>
          <button className={`nav-link ${activePage === "productos" ? "active" : ""}`} onClick={() => onNavigation("/productos")}>Productos</button>
          <button className={`nav-link ${activePage === "servicios" ? "active" : ""}`} onClick={() => onNavigation("/servicios")}>Servicios</button>
        </div>

        {/* Acciones */}
        <div className="nav-actions">
          {/* Wishlist */}
          <Tooltip title="Lista de deseos" arrow>
            <button className="nav-icon-btn" onClick={openWishlist} aria-label="Lista de deseos">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              {wishCount > 0 && <span className="nav-badge">{wishCount}</span>}
            </button>
          </Tooltip>

          {/* Carrito */}
          <Tooltip title="Carrito" arrow>
            <button className="nav-icon-btn" onClick={toggleCart} aria-label="Carrito de compras">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
            </button>
          </Tooltip>

          {user ? (
            <div className="user-actions">
              <Tooltip title="Mi Perfil" arrow>
                <IconButton onClick={() => onMiPerfil?.()} sx={{ p: 0 }}>
                  <PersonIcon sx={{ fontSize: 28, color: "rgba(255,255,255,0.85)" }} />
                </IconButton>
              </Tooltip>
              <span className="user-greeting">Hola, {userName}</span>
              {puedeVerDashboard && (
                <button className="btn btn-dashboard" onClick={onDashboard}>Dashboard</button>
              )}
              <button className="btn btn-logout" onClick={onLogout}>Salir</button>
            </div>
          ) : (
            <button className="btn btn-login" onClick={onLogin}>Iniciar sesión</button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;