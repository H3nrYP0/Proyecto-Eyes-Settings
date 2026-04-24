/**
 * useSidebar - Hook para manejar la lógica del menú lateral
 * 
 * Funcionalidad:
 * - Gestiona permisos del usuario para mostrar/ocultar secciones
 * - Maneja qué sección está expandida (solo una a la vez)
 * - Detecta la sección activa según la ruta actual
 * - Expande automáticamente la sección cuando navegas a una ruta interna
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { menuStructure } from '../constants/menuStructure';

export const useSidebar = (user) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const expandedSectionsRef = useRef(expandedSections);

  useEffect(() => {
    expandedSectionsRef.current = expandedSections;
  }, [expandedSections]);

  const hasPermission = useCallback((sectionId) => {
    if (!user) return false;

    const rawPermisos = user.permisos || user.permissions || [];

    const permisos = rawPermisos.map(p => 
      typeof p === 'string' ? p : p.nombre
    );

    if (permisos.includes('*')) return true;

    const section = menuStructure.find(s => s.id === sectionId);
    if (!section?.permisos) return false;

    return section.permisos.some(permiso => permisos.includes(permiso));

  }, [user]);

  const canViewConfig = useCallback(() => {
    return hasPermission('configuracion');
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

  // Colapsar todas las secciones
  const collapseAllSections = useCallback(() => {
    setExpandedSections({});
  }, []);

  // Expandir UNA sola sección y cerrar las demás
  const expandSection = useCallback((section) => {
    if (!hasPermission(section)) return;

    setIsTransitioning(true);
    // Expande SOLO la sección seleccionada, cierra todas las demás
    setExpandedSections({ [section]: true });
    setTimeout(() => setIsTransitioning(false), 300);
  }, [hasPermission]);

  // Toggle: si ya está expandida la colapsa, si no, expande SOLO esa
  const toggleSection = useCallback((section) => {
    if (!hasPermission(section)) return;

    setIsTransitioning(true);

    setExpandedSections(prev => {
      // Si la sección ya está expandida, la colapsamos
      if (prev[section]) {
        return {};
      }
      // Si no está expandida, expandimos SOLO esta y cerramos las demás
      return { [section]: true };
    });

    setTimeout(() => setIsTransitioning(false), 300);
  }, [hasPermission]);

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
    collapseAllSections,
    isTransitioning,
    closeAllTooltips
  };
};