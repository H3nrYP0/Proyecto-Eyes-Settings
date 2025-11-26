import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROLES, PERMISSIONS } from '../constants/roles';

export const useSidebar = (user) => {
  const [expandedSections, setExpandedSections] = useState({});
  const location = useLocation();

  const hasPermission = useCallback((section) => {
    if (!user?.role) return false;
    if ([ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(user.role)) return true;
    const userPermissions = PERMISSIONS[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(section);
  }, [user]);

  const canViewConfig = useCallback(() => {
    return hasPermission('config:view');
  }, [hasPermission]);

  // CORRECCIÓN: Solo una sección expandida a la vez
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

  // CORRECCIÓN: Auto-expandir la sección activa y cerrar las demás
  useEffect(() => {
    if (activeSection) {
      setExpandedSections(prev => ({
        [activeSection]: true // Solo expande la sección activa
      }));
    }
  }, [activeSection]);

  const toggleSection = useCallback((section) => {
    if (!hasPermission(section)) return;
    
    setExpandedSections(prev => {
      // Si ya está expandida, la contraemos
      if (prev[section]) {
        const newState = { ...prev };
        delete newState[section];
        return newState;
      }
      // Si no está expandida, expandimos solo esta y cerramos las demás
      return {
        [section]: true
      };
    });
  }, [hasPermission]);

  return {
    expandedSections,
    activeSection,
    hasPermission,
    canViewConfig,
    toggleSection
  };
};