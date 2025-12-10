import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";
import { 
  Logout as LogoutIcon, 
  PersonOutline as PersonIcon, 
  Settings as SettingsIcon,
  ChevronLeft as CollapseIcon,
    Home as HomeIcon
} from "@mui/icons-material";

import { useSidebar } from "../../hooks/useSidebar";
import { menuStructure } from "../../constants/menuStructure";
import { IconRenderer } from "../ui/SidebarIcons";
import { ROLES } from "../../constants/roles";
import "../../styles/components/Sidebar.css";

/**
 * Componente para el contenido del header del sidebar
 * Maneja el estado expandido/colapsado y el toggle
 */
const HeaderContent = ({ isOpen, onToggle }) => {
  return (
    <div 
      className="sidebar-header-content"
      // Hacer el header clickeable cuando está colapsado para expandirlo
      onClick={!isOpen ? onToggle : undefined}
      style={{ 
        cursor: !isOpen ? 'pointer' : 'default',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isOpen ? 'flex-start' : 'center'
      }}
    >
      {isOpen ? (
        // Estado expandido: mostrar nombre completo y sistema
        <div className="header-title-container">
          <div className="company-name">Visual Outlet</div>
          <span className="system-name">Sistema de Gestión</span>
        </div>
      ) : (
        // Estado colapsado: mostrar solo las iniciales
        <div className="collapsed-logo">VO</div>
      )}
    </div>
  );
};

/**
 * Componente para mostrar el rol del usuario de forma legible
 * Convierte los códigos de rol en texto descriptivo
 */
const UserRole = ({ role }) => {
  const roleMap = {
    [ROLES.ADMIN]: 'Administrador',
    [ROLES.SUPER_ADMIN]: 'Super Admin', 
    [ROLES.VENDEDOR]: 'Vendedor',
    [ROLES.OPTICO]: 'Óptico'
  };
  
  return roleMap[role] || role;
};

/**
 * Componente para items individuales de navegación
 * Maneja el estado activo y la navegación
 */
const SectionItem = ({ item, isOpen }) => (
  <NavLink 
    to={item.path}
    className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
    end
  >
    {/* Solo mostrar texto cuando el sidebar está expandido */}
    {isOpen && <span className="item-text">{item.name}</span>}
  </NavLink>
);

/**
 * Componente para secciones del menú con capacidad de expandir/colapsar
 * Incluye tooltips para estado colapsado
 */
const MenuSection = ({ section, isOpen, expandedSections, onToggle }) => (
  <div className="nav-section">
    {/* Tooltip que solo se muestra cuando el sidebar está colapsado */}
    <Tooltip 
      title={section.title} 
      placement="right"
      disableHoverListener={isOpen} // Deshabilitar tooltip cuando está expandido
    >
      <button 
        className={`section-header ${expandedSections[section.id] ? 'active' : ''}`}
        onClick={() => onToggle(section.id)}
        data-tooltip={section.title}
      >
        <span className="section-icon">
          <IconRenderer name={section.icon} />
        </span>
        {/* Contenido solo visible cuando expandido */}
        {isOpen && (
          <>
            <span className="section-title">{section.title}</span>
            <span className="section-arrow">▾</span>
          </>
        )}
      </button>
    </Tooltip>

    {/* Mostrar items solo cuando la sección está expandida y el sidebar también */}
    {isOpen && expandedSections[section.id] && (
      <div className="section-items">
        {section.items.map((item) => (
          <SectionItem key={item.path} item={item} isOpen={isOpen} />
        ))}
      </div>
    )}
  </div>
);

/**
 * Componente para el footer del sidebar
 * Muestra información del usuario y botones de acción
 */
const SidebarFooter = ({ isOpen, user, canViewConfig, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-footer">
      {/* Información del usuario */}
      <div className="user-info">
        <div className="user-avatar">
          <PersonIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.9)' }} />
        </div>
        {/* Detalles del usuario solo visibles cuando expandido */}
        {isOpen && (
          <div className="user-details">
            <span className="user-name">{user?.name || "Usuario"}</span>
            <span className="user-role">
              <UserRole role={user?.role} />
            </span>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="sidebar-footer-buttons">
        {/* Ir al Inicio */}
        <Tooltip title="Ir al Inicio" placement="right" disableHoverListener={isOpen}>
          <Button
            className="footer-button"
            variant="outlined"
            size="small"
            startIcon={<HomeIcon />} // Necesitarás importar HomeIcon
            onClick={() => window.location.href = "http://localhost:5173/Proyecto-Eyes-Settings/"}
            data-tooltip="Ir al Inicio"
            sx={{
              color: 'white !important',
              borderColor: 'rgba(255,255,255,0.3) !important',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5) !important',
                backgroundColor: 'rgba(255,255,255,0.1) !important'
              }
            }}
          >
            {/* Texto solo visible cuando expandido */}
            {isOpen && "Ir al Inicio"}
          </Button>
        </Tooltip>

        {/* Botón de configuración - solo visible si el usuario tiene permisos */}
        {canViewConfig() && (
          <Tooltip title="Configuración" placement="right" disableHoverListener={isOpen}>
            <Button
              className="footer-button"
              variant="outlined"
              size="small"
              startIcon={<SettingsIcon />}
              onClick={() => navigate('/admin/configuracion')}
              data-tooltip="Configuración"
              sx={{
                color: 'white !important',
                borderColor: 'rgba(255,255,255,0.3) !important',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5) !important',
                  backgroundColor: 'rgba(255,255,255,0.1) !important'
                }
              }}
            >
              {/* Texto solo visible cuando expandido */}
              {isOpen && "Configuración"}
            </Button>
          </Tooltip>
        )}
        
        {/* Botón de cerrar sesión */}
        <Tooltip title="Cerrar Sesión" placement="right" disableHoverListener={isOpen}>
          <Button
            className="footer-button"
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            data-tooltip="Cerrar Sesión"
            sx={{
              color: 'white !important',
              borderColor: 'rgba(255,255,255,0.3) !important',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5) !important',
                backgroundColor: 'rgba(255,255,255,0.1) !important'
              }
            }}
          >
            {/* Texto solo visible cuando expandido */}
            {isOpen && "Cerrar Sesión"}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
/**
 * Componente principal del Sidebar
 * Gestiona el estado de expansión/colapso y la lógica de permisos
 */
export default function Sidebar({ isOpen, onToggle, user, onLogout }) {
  // Hook personalizado para manejar el estado del sidebar
  const { 
    expandedSections, 
    hasPermission, 
    canViewConfig, 
    toggleSection 
  } = useSidebar(user);

// DEJA ESTO ASÍ, SIN EL FILTRO EXTRA
const filteredSections = useMemo(() => 
  menuStructure.filter(section => hasPermission(section.id)), 
  [hasPermission]
);

  return (
    <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      {/* Header del sidebar */}
      <div className="sidebar-header">
        <HeaderContent isOpen={isOpen} onToggle={onToggle} />
        
        {/* Botón de colapsar - solo visible cuando está expandido */}
        {isOpen && (
          <button className="sidebar-toggle" onClick={onToggle}>
            <CollapseIcon sx={{ fontSize: 16 }} />
          </button>
        )}
      </div>

      {/* Navegación principal */}
      <nav className="sidebar-nav">
        <div className="nav-scroll-container">
          {/* Renderizar secciones filtradas por permisos */}
          {filteredSections.map((section) => (
            <MenuSection 
              key={section.id}
              section={section}
              isOpen={isOpen}
              expandedSections={expandedSections}
              onToggle={toggleSection}
            />
          ))}
        </div>
      </nav>

      {/* Footer del sidebar */}
      <SidebarFooter 
        isOpen={isOpen}
        user={user}
        canViewConfig={canViewConfig}
        onLogout={onLogout}
      />
    </aside>
  );
}