import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import "/src/shared/styles/components/Sidebar.css";

// ESTE ES EL COMPONENTE SIDEBAR - NAVEGACIÓN PRINCIPAL DEL SISTEMA
export default function Sidebar({ isOpen, onToggle, user, onLogout }) {
  // ESTADO PARA CONTROLAR QUÉ SECCIÓN ESTÁ ABIERTA
  const [activeSection, setActiveSection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // ESTA FUNCIÓN VERIFICA SI EL USUARIO TIENE PERMISO PARA UNA SECCIÓN
  const hasPermission = (section) => {
    // SI ES ADMIN, TIENE ACCESO TOTAL
    if (user?.role === ROLES.ADMIN) return true;
    if (!user?.permissions) return false;
    return user.permissions.includes('*') || user.permissions.includes(section);
  };

  // ESTA FUNCIÓN DETERMINA LA SECCIÓN ACTIVA BASADA EN LA URL
  const getActiveSectionFromPath = (pathname) => {
    if (pathname.includes('/compras')) return 'compras';
    if (pathname.includes('/ventas')) return 'ventas';
    if (pathname.includes('/servicios')) return 'servicios';
    if (pathname.includes('/usuarios')) return 'usuarios';
    if (pathname.includes('/configuracion')) return 'configuracion';
    if (pathname.includes('/dashboard')) return 'dashboard';
    return null;
  };

  // ESTE EFFECT ACTUALIZA LA SECCIÓN ACTIVA CUANDO CAMBIA LA URL
  useEffect(() => {
    const currentSection = getActiveSectionFromPath(location.pathname);
    setActiveSection(currentSection);
  }, [location.pathname]);

  // ESTA FUNCIÓN MANEJA EL CLIC EN UNA SECCIÓN DEL MENÚ
  const toggleSection = (section) => {
    if (!hasPermission(section)) {
      alert('No tienes permisos para acceder a esta sección');
      return;
    }
    setActiveSection(activeSection === section ? null : section);
  };

  // ESTE ES EL MENÚ COMPLETO CON TODAS LAS FEATURES DEL SISTEMA
  const menuSections = [
    {
      id: "dashboard",
      title: "Dashboard Principal",
      icon: "dashboard-icon",
      // ESTOS SON LOS ITEMS DEL DASHBOARD
      items: [
        { name: "Resumen General", path: "/admin/dashboard", icon: "home-icon" }
      ]
    },
    {
      id: "ventas",
      title: "Módulo de Ventas",
      icon: "ventas-icon",
      // ESTOS SON LOS ITEMS DEL MÓDULO DE VENTAS
      items: [
        { name: "Ventas", path: "/admin/ventas", icon: "sales-icon" },
        { name: "Clientes", path: "/admin/ventas/clientes", icon: "users-icon" },
        { name: "Pedidos", path: "/admin/ventas/pedidos", icon: "orders-icon" },
        { name: "Abonos", path: "/admin/ventas/abonos", icon: "payment-icon" }
      ]
    },
    {
      id: "compras",
      title: "Compras e Inventario", 
      icon: "compras-icon",
      // ESTOS SON LOS ITEMS DEL MÓDULO DE COMPRAS
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
      title: "Servicios Ópticos",
      icon: "servicios-icon",
      // ESTOS SON LOS ITEMS DEL MÓDULO DE SERVICIOS
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
      title: "Gestión de Usuarios",
      icon: "usuarios-icon",
      // ESTOS SON LOS ITEMS DEL MÓDULO DE USUARIOS
      items: [
        { name: "Usuarios", path: "/admin/usuarios", icon: "users-icon" },
        { name: "Gestión de Acceso", path: "/admin/usuarios/gestion-acceso", icon: "security-icon" }
      ]
    },
    {
      id: "configuracion",
      title: "Configuración",
      icon: "configuracion-icon",
      // ESTOS SON LOS ITEMS DEL MÓDULO DE CONFIGURACIÓN
      items: [
        { name: "Roles", path: "/admin/configuracion/roles", icon: "roles-icon" },
        { name: "Permisos", path: "/admin/configuracion/permisos", icon: "permissions-icon" }
      ]
    }
  ];

  // ESTE ES EL RENDER PRINCIPAL DEL SIDEBAR
  return (
    <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      
      {/* ESTA ES LA CABECERA DEL SIDEBAR */}
      <div className="sidebar-header">
        <h1>Visual Outlet</h1>
        <p>Sistema de Gestión para Ópticas</p>
        <button className="sidebar-toggle" onClick={onToggle}>
          {isOpen ? "◀" : "▶"}
        </button>
      </div>

      {/* ESTA ES LA NAVEGACIÓN PRINCIPAL */}
      <nav className="sidebar-nav">
        <div className="nav-scroll-container">
          {menuSections.map((section) => {
            const userHasPermission = hasPermission(section.id);
            if (!userHasPermission) return null;
            
            return (
              <div key={section.id} className="nav-section">
                
                {/* ESTE ES EL BOTÓN DE CADA SECCIÓN */}
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

                {/* ESTOS SON LOS ITEMS DE CADA SECCIÓN CUANDO ESTÁ ABIERTA */}
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

      {/* ESTE ES EL FOOTER DEL SIDEBAR CON INFO DEL USUARIO */}
      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-avatar"></span>
          {isOpen && (
            <div className="user-details">
              <span className="user-name">{user?.name || "Usuario"}</span>
              <span className="user-role">
                {user?.role === ROLES.ADMIN ? 'Administrador' : 
                 user?.role === ROLES.DEMO ? 'Usuario Demo' : user?.role}
              </span>
            </div>
          )}
        </div>
        
        {/* ESTE ES EL BOTÓN DE CERRAR SESIÓN */}
        {isOpen && (
          <button className="logout-button" onClick={onLogout}>
            Cerrar Sesión
          </button>
        )}
      </div>
    </aside>
  );
}