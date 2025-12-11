import { useMemo, useCallback, useEffect } from "react";
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
      onClick={onToggle}
      style={{ 
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isOpen ? 'space-between' : 'center',
        padding: '0 16px'
      }}
    >
      {isOpen ? (
        <div className="header-title-container">
          <div className="company-name">Visual Outlet</div>
          <span className="system-name">Sistema de Gestión</span>
        </div>
      ) : (
        <div className="collapsed-logo">VO</div>
      )}
      
      {isOpen ? (
        <button 
          className="sidebar-toggle"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CollapseIcon sx={{ fontSize: 16 }} />
        </button>
      ) : (
        <div className="expand-indicator">
          <CollapseIcon sx={{ 
            fontSize: 16, 
            transform: 'rotate(180deg)',
            opacity: 0.7
          }} />
        </div>
      )}
    </div>
  );
};

/**
 * Componente para mostrar el rol del usuario
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
 */
const SectionItem = ({ item, isOpen, onExpandSidebar }) => {
  const navigate = useNavigate();
  
  const handleClick = useCallback((e) => {
    if (!isOpen) {
      e.preventDefault();
      e.stopPropagation();
      onExpandSidebar && onExpandSidebar();
      setTimeout(() => {
        navigate(item.path);
      }, 150);
    }
  }, [isOpen, onExpandSidebar, navigate, item.path]);

  return (
    <NavLink 
      to={item.path}
      className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
      end
      onClick={handleClick}
      style={{ textDecoration: 'none' }}
    >
      {!isOpen && (
        <span className="collapsed-item-icon">
          <IconRenderer name={item.icon || 'DefaultIcon'} />
        </span>
      )}
      {isOpen && <span className="item-text" style={{ color: 'inherit' }}>{item.name}</span>}
    </NavLink>
  );
};

/**
 * Componente para secciones del menú
 */
const MenuSection = ({ section, isOpen, expandedSections, onToggle, onExpandSidebar }) => {
  const handleSectionClick = useCallback((e) => {
    if (!isOpen) {
      e.preventDefault();
      e.stopPropagation();
      onExpandSidebar && onExpandSidebar(section.id);
    } else {
      onToggle(section.id);
    }
  }, [isOpen, onToggle, onExpandSidebar, section.id]);

  return (
    <div className="nav-section">
      {/* Tooltip SOLO cuando sidebar está colapsado */}
      {!isOpen ? (
        <Tooltip 
          title={section.title} 
          placement="right"
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: '#1e293b',
                color: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                fontSize: '0.85rem',
                padding: '8px 12px',
              }
            }
          }}
        >
          <button 
            className={`section-header ${expandedSections[section.id] ? 'active' : ''}`}
            onClick={handleSectionClick}
            style={{ 
              color: 'inherit', 
              textDecoration: 'none',
              fontFamily: 'inherit'
            }}
          >
            <span className="section-icon">
              <IconRenderer name={section.icon} />
            </span>
          </button>
        </Tooltip>
      ) : (
        // Sin tooltip cuando sidebar está expandido
        <button 
          className={`section-header ${expandedSections[section.id] ? 'active' : ''}`}
          onClick={handleSectionClick}
          style={{ 
            color: 'inherit', 
            textDecoration: 'none',
            fontFamily: 'inherit'
          }}
        >
          <span className="section-icon">
            <IconRenderer name={section.icon} />
          </span>
          {isOpen && (
            <>
              <span 
                className="section-title"
                style={{ color: 'inherit' }}
              >
                {section.title}
              </span>
              <span className="section-arrow" style={{ color: 'inherit' }}>▾</span>
            </>
          )}
        </button>
      )}

      {/* Items cuando el menú está expandido */}
      {isOpen && expandedSections[section.id] && (
        <div className="section-items">
          {section.items.map((item) => (
            <SectionItem 
              key={item.path} 
              item={item} 
              isOpen={isOpen}
              onExpandSidebar={() => onExpandSidebar && onExpandSidebar(section.id)}
            />
          ))}
        </div>
      )}
      
      {/* Mini-items cuando el menú está colapsado */}
      {!isOpen && (
        <div className="collapsed-items">
          {section.items.map((item) => (
            <Tooltip 
              key={item.path} 
              title={item.name} 
              placement="right"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#1e293b',
                    color: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    padding: '8px 12px',
                  }
                }
              }}
            >
              <div 
                className="collapsed-item-wrapper"
                onClick={() => onExpandSidebar && onExpandSidebar(section.id)}
                style={{ color: 'inherit' }}
              >
                <IconRenderer name={item.icon || 'DefaultIcon'} />
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Componente para el footer del sidebar
 */
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
            <span className="user-name" style={{ color: 'inherit' }}>{user?.name || "Usuario"}</span>
            <span className="user-role" style={{ color: 'inherit' }}>
              <UserRole role={user?.role} />
            </span>
          </div>
        )}
      </div>

      <div className="sidebar-footer-buttons">
        {/* Botón Ir al Inicio */}
        {!isOpen ? (
          <Tooltip title="Ir al Inicio" placement="right">
            <Button
              className="footer-button"
              variant="outlined"
              size="small"
              sx={{
                minWidth: 'auto',
                width: '40px',
                height: '40px',
                padding: '0 !important',
                color: 'white !important',
                borderColor: 'rgba(255,255,255,0.3) !important',
                borderRadius: '8px !important',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5) !important',
                  backgroundColor: 'rgba(255,255,255,0.1) !important'
                },
                '& .MuiButton-startIcon': {
                  margin: 0
                }
              }}
              startIcon={<HomeIcon />}
              onClick={() => window.location.href = "http://localhost:5173/Proyecto-Eyes-Settings/"}
            />
          </Tooltip>
        ) : (
          <Button
            className="footer-button"
            variant="outlined"
            size="small"
            startIcon={<HomeIcon />}
            onClick={() => window.location.href = "http://localhost:5173/Proyecto-Eyes-Settings/"}
            sx={{
              color: 'white !important',
              borderColor: 'rgba(255,255,255,0.3) !important',
              borderRadius: '8px !important',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5) !important',
                backgroundColor: 'rgba(255,255,255,0.1) !important'
              },
              '& .MuiButton-startIcon': {
                marginRight: '8px'
              }
            }}
            fullWidth
          >
            <span style={{ color: 'inherit' }}>Ir al Inicio</span>
          </Button>
        )}

        {/* Botón Configuración */}
        {canViewConfig() && (
          !isOpen ? (
            <Tooltip title="Configuración" placement="right">
              <Button
                className="footer-button"
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 'auto',
                  width: '40px',
                  height: '40px',
                  padding: '0 !important',
                  color: 'white !important',
                  borderColor: 'rgba(255,255,255,0.3) !important',
                  borderRadius: '8px !important',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5) !important',
                    backgroundColor: 'rgba(255,255,255,0.1) !important'
                  },
                  '& .MuiButton-startIcon': {
                    margin: 0
                  }
                }}
                startIcon={<SettingsIcon />}
                onClick={() => navigate('/admin/configuracion')}
              />
            </Tooltip>
          ) : (
            <Button
              className="footer-button"
              variant="outlined"
              size="small"
              startIcon={<SettingsIcon />}
              onClick={() => navigate('/admin/configuracion')}
              sx={{
                color: 'white !important',
                borderColor: 'rgba(255,255,255,0.3) !important',
                borderRadius: '8px !important',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5) !important',
                  backgroundColor: 'rgba(255,255,255,0.1) !important'
                },
                '& .MuiButton-startIcon': {
                  marginRight: '8px'
                }
              }}
              fullWidth
            >
              <span style={{ color: 'inherit' }}>Configuración</span>
            </Button>
          )
        )}
        
        {/* Botón Cerrar Sesión */}
        {!isOpen ? (
          <Tooltip title="Cerrar Sesión" placement="right">
            <Button
              className="footer-button"
              variant="outlined"
              size="small"
              sx={{
                minWidth: 'auto',
                width: '40px',
                height: '40px',
                padding: '0 !important',
                color: 'white !important',
                borderColor: 'rgba(255,255,255,0.3) !important',
                borderRadius: '8px !important',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5) !important',
                  backgroundColor: 'rgba(255,255,255,0.1) !important'
                },
                '& .MuiButton-startIcon': {
                  margin: 0
                }
              }}
              startIcon={<LogoutIcon />}
              onClick={onLogout}
            />
          </Tooltip>
        ) : (
          <Button
            className="footer-button"
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            sx={{
              color: 'white !important',
              borderColor: 'rgba(255,255,255,0.3) !important',
              borderRadius: '8px !important',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5) !important',
                backgroundColor: 'rgba(255,255,255,0.1) !important'
              },
              '& .MuiButton-startIcon': {
                marginRight: '8px'
              }
            }}
            fullWidth
          >
            <span style={{ color: 'inherit' }}>Cerrar Sesión</span>
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Componente principal del Sidebar
 */
export default function Sidebar({ isOpen, onToggle, user, onLogout }) {
  const { 
    expandedSections, 
    hasPermission, 
    canViewConfig, 
    toggleSection,
    expandSection 
  } = useSidebar(user);

  const filteredSections = useMemo(() => 
    menuStructure.filter(section => hasPermission(section.id)), 
    [hasPermission]
  );

  const handleExpandSidebar = useCallback((sectionId) => {
    if (!isOpen) {
      onToggle();
      setTimeout(() => {
        expandSection(sectionId);
      }, 100);
    }
  }, [isOpen, onToggle, expandSection]);

  return (
    <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <div className="sidebar-header">
        <HeaderContent isOpen={isOpen} onToggle={onToggle} />
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
              onExpandSidebar={handleExpandSidebar}
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