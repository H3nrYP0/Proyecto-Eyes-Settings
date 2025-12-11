import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ROLES, PERMISSIONS } from '../constants/roles';

export const useSidebar = (user) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  
  // Usamos una referencia para tener siempre el valor más reciente
  const expandedSectionsRef = useRef(expandedSections);
  
  // Actualizamos la referencia cada vez que cambia el estado
  useEffect(() => {
    expandedSectionsRef.current = expandedSections;
  }, [expandedSections]);

  const hasPermission = useCallback((section) => {
    if (!user?.role) return false;
    if ([ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(user.role)) return true;
    const userPermissions = PERMISSIONS[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(section);
  }, [user]);

  const canViewConfig = useCallback(() => {
    return hasPermission('config:view');
  }, [hasPermission]);

  const activeSection = useMemo(() => {
    const pathSections = [
      { path: '/compras', section: 'compras' },
      { path: '/ventas', section: 'ventas' },
      { path: '/servicios', section: 'servicios' },
      { path: '/usuarios', section: 'usuarios' },
      { path: '/seguridad', section: 'seguridad' },
      { path: '/configuracion', section: 'configuracion' },
      { path: '/dashboard', section: 'dashboard' }
    ];
    
    const found = pathSections.find(({ path }) => location.pathname.includes(path));
    return found ? found.section : null;
  }, [location.pathname]);

  useEffect(() => {
    if (activeSection) {
      setExpandedSections({
        [activeSection]: true
      });
    }
  }, [activeSection]);

  const toggleSection = useCallback((section) => {
    if (!hasPermission(section)) return;
    
    // Indicar que estamos en transición para evitar tooltips
    setIsTransitioning(true);
    
    setExpandedSections(prev => {
      if (prev[section]) {
        const newState = { ...prev };
        delete newState[section];
        return newState;
      }
      
      return {
        [section]: true
      };
    });
    
    // Terminar transición después de un momento
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [hasPermission]);

  // Nueva función para expandir automáticamente una sección
  const expandSection = useCallback((section) => {
    if (!hasPermission(section)) return;
    
    setIsTransitioning(true);
    
    setExpandedSections(prev => ({
      ...prev,
      [section]: true
    }));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [hasPermission]);

  // Función para cerrar todos los tooltips
  const closeAllTooltips = useCallback(() => {
    const tooltips = document.querySelectorAll('.MuiTooltip-popper, .MuiTooltip-tooltip, [role="tooltip"]');
    tooltips.forEach(tooltip => {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.display = 'none';
    });
  }, []);

  return {
    expandedSections,
    activeSection,
    hasPermission,
    canViewConfig,
    toggleSection,
    expandSection,
    isTransitioning,
    closeAllTooltips
  };
};