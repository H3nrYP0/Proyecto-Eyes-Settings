import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardSidebar.css";

const Sidebar = ({ isOpen, onToggle, user }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const navigate = useNavigate(); // ✅ para navegación sin recargar

  const toggleSubmenu = (menuKey) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  // ✅ Menú completo con todos los módulos
  const menuStructure = [
    {
      key: "dashboard",
      icon: "📊",
      label: "Dashboard",
      path: "/admin",
    },
    {
      key: "configuracion",
      icon: "⚙️",
      label: "Configuración",
      submenus: [
        { icon: "👥", label: "Roles", path: "/admin/roles" },
        { icon: "🔐", label: "Permisos", path: "/admin/permisos" },
      ],
    },
    {
      key: "usuarios",
      icon: "👤",
      label: "Usuarios",
      submenus: [
        { icon: "👥", label: "Gestión de usuarios", path: "/admin/gestion-usuarios" },
        { icon: "🔒", label: "Gestión de acceso", path: "/admin/gestion-acceso" },
      ],
    },
    {
      key: "compras",
      icon: "🛒",
      label: "Compras",
      submenus: [
        { icon: "📁", label: "Categoría de productos", path: "/admin/categorias" },
        { icon: "📦", label: "Productos", path: "/admin/productos" },
        { icon: "🏷️", label: "Marcas", path: "/admin/marcas" },
        { icon: "🚚", label: "Proveedores", path: "/admin/proveedores" },
        { icon: "💰", label: "Compras", path: "/admin/compras" },
      ],
    },
    {
      key: "servicios",
      icon: "🔧",
      label: "Servicios",
      submenus: [
        { icon: "🛠️", label: "Servicios", path: "/admin/servicios" },
        { icon: "📅", label: "Agenda", path: "/admin/agenda" },
        { icon: "⏰", label: "Horarios", path: "/admin/horarios" },
        { icon: "🏥", label: "Campañas de Salud", path: "/admin/campanas-salud" },
        { icon: "💼", label: "Empleados", path: "/admin/empleados" },
      ],
    },
    {
      key: "ventas",
      icon: "💰",
      label: "Ventas",
      submenus: [
        { icon: "👥", label: "Clientes", path: "/admin/clientes" },
        { icon: "📋", label: "Pedidos", path: "/admin/pedidos" },
        { icon: "💳", label: "Abonos", path: "/admin/abonos" },
        { icon: "💸", label: "Ventas", path: "/admin/ventas" },
      ],
    },
  ];

  // ✅ Navegación real sin recargar
  const navigateTo = (path) => {
    navigate(path);
  };

  const goBackToClient = () => {
    navigate("/");
  };

  return (
    <aside className={`dashboard-sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Header del Sidebar */}
      <div className="sidebar-header">
        {isOpen && (
          <div className="sidebar-logo">
            <h2>Visual Outlet</h2>
            <p>Optical Administration</p>
          </div>
        )}
        <button className="sidebar-close" onClick={onToggle}>
          {isOpen ? "‹" : "›"}
        </button>
      </div>

      {/* Información del Usuario */}
      <div className="user-info">
        <div className="user-avatar">
          {user?.name ? user.name[0].toUpperCase() : "?"}
        </div>
        {isOpen && (
          <div className="user-details">
            <h4>{user?.name || "Usuario"}</h4>
            <span>Administrador</span>
          </div>
        )}
      </div>

      {/* Menú de navegación */}
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuStructure.map((menu) => (
            <li key={menu.key} className="sidebar-item">
              {menu.path ? (
                // 🔹 Menú sin submenús
                <button
                  className="sidebar-main-link no-submenu"
                  onClick={() => navigateTo(menu.path)}
                >
                  <span className="sidebar-icon">{menu.icon}</span>
                  {isOpen && <span className="sidebar-label">{menu.label}</span>}
                </button>
              ) : (
                // 🔹 Menú con submenús
                <>
                  <button
                    className={`sidebar-main-link ${
                      openSubmenus[menu.key] ? "active" : ""
                    }`}
                    onClick={() => toggleSubmenu(menu.key)}
                  >
                    <span className="sidebar-icon">{menu.icon}</span>
                    {isOpen && (
                      <>
                        <span className="sidebar-label">{menu.label}</span>
                        <span
                          className={`sidebar-arrow ${
                            openSubmenus[menu.key] ? "open" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </>
                    )}
                  </button>

                  {/* Submenús */}
                  {isOpen && openSubmenus[menu.key] && (
                    <ul className="sidebar-submenu">
                      {menu.submenus.map((submenu, i) => (
                        <li key={i} className="sidebar-subitem">
                          <button
                            className="sidebar-sublink"
                            onClick={() => navigateTo(submenu.path)}
                          >
                            <span className="sidebar-subicon">{submenu.icon}</span>
                            <span className="sidebar-sublabel">
                              {submenu.label}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Volver al cliente */}
      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={goBackToClient}
          title="Volver a la página principal"
        >
          <span className="logout-icon">🏠</span>
          {isOpen && <span>Volver al Cliente</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
