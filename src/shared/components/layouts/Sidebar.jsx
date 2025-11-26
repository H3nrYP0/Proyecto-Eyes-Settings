import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { Logout as LogoutIcon, PersonOutlineOutlined as PersonOutlineOutlinedIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { ROLES, PERMISSIONS } from "../../constants/roles";
import "/src/shared/styles/components/Sidebar.css";

// Componente Sidebar - Navegación principal del sistema
export default function Sidebar({ isOpen, onToggle, user, onLogout }) {
  // Estado para controlar qué sección está abierta
  const [activeSection, setActiveSection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Función que verifica si el usuario tiene permiso para una sección
  const hasPermission = (section) => {
    if (!user?.role) return false;
    
    // Si es admin o super admin, tiene acceso total
    if (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN) {
      return true;
    }
    
    // Para otros roles, verificar permisos específicos
    const userPermissions = PERMISSIONS[user.role] || [];
    
    return userPermissions.includes('*') || userPermissions.includes(section);
  };

  // Función específica para configuración
  const canViewConfig = () => {
    if (!user?.role) return false;
    const userPermissions = PERMISSIONS[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes('config:view');
  };

  // Función que determina la sección activa basada en la URL
  const getActiveSectionFromPath = (pathname) => {
    if (pathname.includes('/compras')) return 'compras';
    if (pathname.includes('/ventas')) return 'ventas';
    if (pathname.includes('/servicios')) return 'servicios';
    if (pathname.includes('/usuarios')) return 'usuarios';
    if (pathname.includes('/seguridad')) return 'seguridad';
    if (pathname.includes('/configuracion')) return 'configuracion';
    if (pathname.includes('/dashboard')) return 'dashboard';
    return null;
  };

  // Effect que actualiza la sección activa cuando cambia la URL
  useEffect(() => {
    const currentSection = getActiveSectionFromPath(location.pathname);
    setActiveSection(currentSection);
  }, [location.pathname]);

  // Función que maneja el clic en una sección del menú
  const toggleSection = (section) => {
    if (!hasPermission(section)) {
      alert('No tienes permisos para acceder a esta sección');
      return;
    }
    setActiveSection(activeSection === section ? null : section);
  };

  // Menú completo con todas las features del sistema
  const menuSections = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "dashboard-icon",
      items: [
        { name: "Resumen General", path: "/admin/dashboard", icon: "home-icon" }
      ]
    },
    {
      id: "ventas",
      title: "Ventas",
      icon: "ventas-icon",
      items: [
        { name: "Ventas", path: "/admin/ventas", icon: "sales-icon" },
        { name: "Clientes", path: "/admin/ventas/clientes", icon: "users-icon" },
        { name: "Pedidos", path: "/admin/ventas/pedidos", icon: "orders-icon" },
        { name: "Abonos", path: "/admin/ventas/abonos", icon: "payment-icon" }
      ]
    },
    {
      id: "compras",
      title: "Compras", 
      icon: "compras-icon",
      items: [
        { name: "Compras", path: "/admin/compras", icon: "purchase-icon" },
        { name: "Productos", path: "/admin/compras/productos", icon: "products-icon" },
        { name: "Categorías", path: "/admin/compras/categorias", icon: "categories-icon" },
        { name: "Marcas", path: "/admin/compras/marcas", icon: "brands-icon" },
        { name: "Proveedores", path: "/admin/compras/proveedores", icon: "suppliers-icon" }
      ]
    },
    {
      id: "servicios",
      title: "Servicios",
      icon: "servicios-icon",
      items: [
        { name: "Servicios", path: "/admin/servicios", icon: "services-icon" },
        { name: "Agenda", path: "/admin/servicios/agenda", icon: "calendar-icon" },
        { name: "Empleados", path: "/admin/servicios/empleados", icon: "employees-icon" },
        { name: "Horarios", path: "/admin/servicios/horarios", icon: "time-icon" },
        { name: "Campañas de Salud", path: "/admin/servicios/campanas-salud", icon: "campaigns-icon" }
      ]
    },
    {
      id: "usuarios", 
      title: "Usuarios",
      icon: "usuarios-icon",
      items: [
        { name: "Usuarios", path: "/admin/usuarios", icon: "users-icon" },
        { name: "Gestión de Acceso", path: "/admin/usuarios/gestion-acceso", icon: "security-icon" }
      ]
    },
    {
      id: "seguridad",
      title: "Seguridad",
      icon: "seguridad-icon",
      items: [
        { name: "Roles", path: "/admin/seguridad/roles", icon: "roles-icon" }
      ]
    },
  ].filter(section => hasPermission(section.id));

  // Render principal del sidebar
  return (
    <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      
      {/* Cabecera del sidebar */}
      <div className="sidebar-header">
        <h1>Visual Outlet</h1>
        <p>Sistema de Gestión</p>
        <button className="sidebar-toggle" onClick={onToggle}>
          {isOpen ? "◀" : "▶"}
        </button>
      </div>

      {/* Navegación principal */}
      <nav className="sidebar-nav">
        <div className="nav-scroll-container">
          {menuSections.map((section) => {
            const userHasPermission = hasPermission(section.id);
            if (!userHasPermission) return null;
            
            return (
              <div key={section.id} className="nav-section">
                
                {/* Botón de cada sección */}
                <button 
                  className={`section-header ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => toggleSection(section.id)}
                >
                  <span className={`section-icon ${section.icon}`}></span>
                  {isOpen && (
                    <>
                      <span className="section-title">{section.title}</span>
                      <span className="section-arrow">
                        {activeSection === section.id ? "▾" : "▸"}
                      </span>
                    </>
                  )}
                </button>

                {/* Items de cada sección cuando está abierta */}
                {isOpen && activeSection === section.id && (
                  <div className="section-items">
                    {section.items.map((item) => (
                      <NavLink 
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                          `nav-item ${isActive ? 'nav-item-active' : ''}`
                        }
                        end={item.path === '/admin/dashboard'}
                      >
                        <span className={`item-icon ${item.icon}`}></span>
                        <span className="item-text">{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer del sidebar con info del usuario, configuración y cerrar sesión */}
      <div className="sidebar-footer">
        {/* Información del usuario */}
        <div className="user-info">
          <div className="user-avatar">
            <PersonOutlineOutlinedIcon 
              sx={{ 
                fontSize: 24,
                color: 'white'
              }} 
            />
          </div>
          {isOpen && (
            <div className="user-details">
              <span className="user-name">{user?.name || "Usuario"}</span>
              <span className="user-role">
                {user?.role === ROLES.ADMIN ? 'Administrador' : 
                 user?.role === ROLES.SUPER_ADMIN ? 'Super Admin' :
                 user?.role === ROLES.VENDEDOR ? 'Vendedor' :
                 user?.role === ROLES.OPTICO ? 'Óptico' : user?.role}
              </span>
            </div>
          )}
        </div>

        {/* Botón de Configuración - Solo visible si tiene permiso */}
        {isOpen && canViewConfig() && (
          <Box sx={{ mt: 1, px: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => navigate('/admin/configuracion')}
              sx={{
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: '500',
                borderRadius: 2,
                py: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Configuración
            </Button>
          </Box>
        )}
        
        {/* Botón de cerrar sesión */}
        {isOpen && (
          <Box sx={{ mt: 1, px: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
              sx={{
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: '500',
                borderRadius: 2,
                py: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        )}
      </div>
    </aside>
  );
}