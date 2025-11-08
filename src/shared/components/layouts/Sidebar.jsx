import { useNavigate, useLocation } from "react-router-dom";

// Styles
import "/src/shared/styles/components/Sidebar.css";

const menuStructure = [
  {
    key: "dashboard",
    icon: "📊",
    label: "Dashboard", 
    path: "/admin"
  },
  {
    key: "home", 
    icon: "🏠",
    label: "Home",
    path: "/admin/home"
  },
  {
    key: "configuracion",
    icon: "⚙️",
    label: "Configuración",
    submenus: [
      { icon: "👥", label: "Roles", path: "/admin/configuracion/roles" }, 
      { icon: "🔐", label: "Permisos", path: "/admin/configuracion/permisos" } 
    ]
  },
  {
    key: "usuarios",
    icon: "👤", 
    label: "Usuarios", 
    submenus: [
      { icon: "👥", label: "Gestión de usuarios", path: "/admin/usuarios" },
      { icon: "🔒", label: "Gestión de acceso", path: "/admin/usuarios/gestion-acceso" } 
    ]
  },
  {
    key: "compras",
    icon: "🛒",
    label: "Compras",
    submenus: [
      { icon: "💰", label: "Compras", path: "/admin/compras" },
      { icon: "📁", label: "Categorías", path: "/admin/compras/categories" },
      { icon: "📦", label: "Productos", path: "/admin/compras/productos" },
      { icon: "🏷️", label: "Marcas", path: "/admin/compras/marcas" },
      { icon: "🚚", label: "Proveedores", path: "/admin/compras/proveedores" },
      { icon: "➕", label: "Crear Marca", path: "/admin/compras/crear-marca" }
    ]
  },
  {
    key: "servicios", 
    icon: "🔧",
    label: "Servicios",
    submenus: [
      { icon: "🛠️", label: "Servicios", path: "/admin/servicios" }, 
      { icon: "💼", label: "Empleados", path: "/admin/servicios/empleados" }, 
      { icon: "📅", label: "Agenda", path: "/admin/servicios/agenda" },
      { icon: "⏰", label: "Horarios", path: "/admin/servicios/horarios" }, 
      { icon: "🏥", label: "Campañas de Salud", path: "/admin/servicios/campanas-salud" } 
    ]
  },
  {
    key: "ventas",
    icon: "💰", 
    label: "Ventas",
    submenus: [
      { icon: "💸", label: "Ventas", path: "/admin/ventas" }, 
      { icon: "👥", label: "Clientes", path: "/admin/ventas/clientes" }, 
      { icon: "📋", label: "Pedidos", path: "/admin/ventas/pedidos" }, 
      { icon: "💳", label: "Abonos", path: "/admin/ventas/abonos" } 
    ]
  }
];

export default function Sidebar({ isOpen, onToggle, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <div key={item.key}>
        {item.submenus ? (
          <div className="menu-group">
            <div className="menu-header">
              <span>{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </div>
            {isOpen && (
              <div className="submenu">
                {item.submenus.map((subitem) => (
                  <div
                    key={subitem.path}
                    className={`menu-item ${isActive(subitem.path) ? 'active' : ''}`}
                    onClick={() => navigate(subitem.path)}
                  >
                    <span>{subitem.icon}</span>
                    <span>{subitem.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span>{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button onClick={onToggle} className="toggle-btn">
          {isOpen ? '◀' : '▶'}
        </button>
        {isOpen && <h3>Visual Outlet</h3>}
      </div>
      
      <div className="sidebar-content">
        {renderMenuItems(menuStructure)}
      </div>

      {isOpen && user && (
        <div className="sidebar-footer">
          <p>👋 Hola, {user.name}</p>
        </div>
      )}
    </div>
  );
}