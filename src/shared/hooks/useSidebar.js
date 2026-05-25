/**
 * useSidebar - Hook para manejar la lógica del menú lateral
 * 
 * Funcionalidad:
 * - Gestiona permisos del usuario (ahora granulares) para mostrar/ocultar secciones
 * - Maneja qué sección está expandida (solo una a la vez)
 * - Detecta la sección activa según la ruta actual
 * - Expande automáticamente la sección cuando navegas a una ruta interna
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { menuStructure } from '../constants/menuStructure';

export const useSidebar = (user) => {
  const [expandedSections, setExpandedSections] = useState({});
  const location = useLocation();

  // Función principal de permisos: recibe el array de permisos requeridos por el elemento del menú
  const hasPermission = useCallback((permisosRequeridos) => {
    if (!user || !user.permisos) return false;
    if (!permisosRequeridos || permisosRequeridos.length === 0) return true;
    // user.permisos ya es un array de strings (ej: ["ver_dashboard", "ver_ventas", ...])
    // Comprobamos si al menos uno de los requeridos está presente
    return permisosRequeridos.some(req => user.permisos.includes(req));
  }, [user]);

  // Para compatibilidad con llamadas que pasan solo el id de la sección
  const hasPermissionForSection = useCallback((sectionId) => {
    const section = menuStructure.find(s => s.id === sectionId);
    if (!section) return false;
    return hasPermission(section.permisos);
  }, [hasPermission]);

  const canViewConfig = useCallback(() => {
    return hasPermission(["gestionar_configuracion"]);
  }, [hasPermission]);

  const activeSection = useMemo(() => {
    const pathSections = [
      { path: '/admin/compras', section: 'compras' },
      { path: '/admin/ventas', section: 'ventas' },
      { path: '/admin/servicios', section: 'servicios' },
      { path: '/admin/seguridad', section: 'seguridad' },
      { path: '/admin/dashboard', section: 'dashboard' }
    ];
    const found = pathSections.find(({ path }) => location.pathname.includes(path));
    return found ? found.section : null;
  }, [location.pathname]);

  useEffect(() => {
    if (activeSection && activeSection !== 'dashboard') {
      setExpandedSections(prev => ({ ...prev, [activeSection]: true }));
    }
  }, [activeSection]);

  const collapseAllSections = useCallback(() => {
    setExpandedSections({});
  }, []);

  const expandSection = useCallback((section) => {
    if (!hasPermissionForSection(section)) return;
    setExpandedSections({ [section]: true });
  }, [hasPermissionForSection]);

  const toggleSection = useCallback((section) => {
    if (!hasPermissionForSection(section)) return;
    setExpandedSections(prev => {
      if (prev[section]) return {};
      return { [section]: true };
    });
  }, [hasPermissionForSection]);

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
    hasPermission: hasPermissionForSection,   // para usar con section.id
    canViewConfig,
    toggleSection,
    expandSection,
    collapseAllSections,
    closeAllTooltips
  };
};