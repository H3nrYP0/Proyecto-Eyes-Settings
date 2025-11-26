// components/layouts/Sidebar.jsx
import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";
import { 
  Logout as LogoutIcon, 
  PersonOutline as PersonIcon, 
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as CollapseIcon
} from "@mui/icons-material";

import { useSidebar } from "../../hooks/useSidebar";
import { menuStructure } from "../../constants/menuStructure";
import { IconRenderer } from "../ui/SidebarIcons";
import { ROLES } from "../../constants/roles";
import "../../styles/components/Sidebar.css";

const HeaderContent = ({ isOpen }) => {
  return (
    <div className="sidebar-header-content">
      {isOpen ? (
        <>
          <h1>Visual Outlet</h1>
          <p>Sistema de Gestión</p>
        </>
      ) : (
        <div className="collapsed-logo">VO</div>
      )}
    </div>
  );
};

const UserRole = ({ role }) => {
  const roleMap = {
    [ROLES.ADMIN]: 'Administrador',
    [ROLES.SUPER_ADMIN]: 'Super Admin', 
    [ROLES.VENDEDOR]: 'Vendedor',
    [ROLES.OPTICO]: 'Óptico'
  };
  
  return roleMap[role] || role;
};

const SectionItem = ({ item, isOpen }) => (
  <NavLink 
    to={item.path}
    className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
    end
  >
    <span className="item-icon">
      <IconRenderer name={item.icon} />
    </span>
    {isOpen && <span className="item-text">{item.name}</span>}
  </NavLink>
);

const MenuSection = ({ section, isOpen, expandedSections, onToggle }) => (
  <div className="nav-section">
    <button 
      className={`section-header ${expandedSections[section.id] ? 'active' : ''}`}
      onClick={() => onToggle(section.id)}
      data-tooltip={section.title}
    >
      <span className="section-icon">
        <IconRenderer name={section.icon} />
      </span>
      {isOpen && (
        <>
          <span className="section-title">{section.title}</span>
          <span className="section-arrow">▾</span>
        </>
      )}
    </button>

    {isOpen && expandedSections[section.id] && (
      <div className="section-items">
        {section.items.map((item) => (
          <SectionItem key={item.path} item={item} isOpen={isOpen} />
        ))}
      </div>
    )}
  </div>
);

const SidebarFooter = ({ isOpen, user, canViewConfig, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-footer">
      <div className="user-info">
        <div className="user-avatar">
          <PersonIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.9)' }} />
        </div>
        {isOpen && (
          <div className="user-details">
            <span className="user-name">{user?.name || "Usuario"}</span>
            <span className="user-role">
              <UserRole role={user?.role} />
            </span>
          </div>
        )}
      </div>

      <div className="sidebar-footer-buttons">
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
              {isOpen && "Configuración"}
            </Button>
          </Tooltip>
        )}
        
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
            {isOpen && "Cerrar Sesión"}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default function Sidebar({ isOpen, onToggle, user, onLogout }) {
  const { 
    expandedSections, 
    hasPermission, 
    canViewConfig, 
    toggleSection 
  } = useSidebar(user);

  const filteredSections = useMemo(() => 
    menuStructure.filter(section => hasPermission(section.id)), 
    [hasPermission]
  );

  return (
    <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <div className="sidebar-header">
        <HeaderContent isOpen={isOpen} />
        <button className="sidebar-toggle" onClick={onToggle}>
          {isOpen ? <CollapseIcon sx={{ fontSize: 16 }} /> : <MenuIcon sx={{ fontSize: 16 }} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-scroll-container">
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

      <SidebarFooter 
        isOpen={isOpen}
        user={user}
        canViewConfig={canViewConfig}
        onLogout={onLogout}
      />
    </aside>
  );
}