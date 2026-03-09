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

  // =============================================
  // hasPermission
  // Verifica si el usuario puede ver una sección
  // usando los permisos reales del backend
  // =============================================
  const hasPermission = useCallback((sectionId) => {
  if (!user) return false;

  const rawPermisos = user.permisos || user.permissions || [];

  // ── Normalizar: soporta tanto strings como objetos {id, nombre} ──
  const permisos = rawPermisos.map(p => 
    typeof p === 'string' ? p : p.nombre
  );

  // ── Acceso total si tiene '*' ──
  if (permisos.includes('*')) return true;

  // ── Buscar la sección en el menú ──
  const section = menuStructure.find(s => s.id === sectionId);
  if (!section?.permisos) return false;

  return section.permisos.some(permiso => permisos.includes(permiso));

}, [user]);

  const canViewConfig = useCallback(() => {
    return hasPermission('configuracion');
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
      setExpandedSections({ [activeSection]: true });
    }
  }, [activeSection]);

  const toggleSection = useCallback((section) => {
    if (!hasPermission(section)) return;

    setIsTransitioning(true);

    setExpandedSections(prev => {
      if (prev[section]) {
        const newState = { ...prev };
        delete newState[section];
        return newState;
      }
      return { [section]: true };
    });

    setTimeout(() => setIsTransitioning(false), 300);
  }, [hasPermission]);

  const expandSection = useCallback((section) => {
    if (!hasPermission(section)) return;

    setIsTransitioning(true);
    setExpandedSections(prev => ({ ...prev, [section]: true }));
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
    isTransitioning,
    closeAllTooltips
  };
};