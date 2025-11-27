// Utilidades para formatear números y textos

/**
 * Formatea valores monetarios (K, M)
 */
export const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

/**
 * Formatea valores del eje Y (K, M)
 */
export const formatYAxis = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

/**
 * Obtiene texto del período para títulos
 */
export const getPeriodText = (timeFilter, yearFilter = '2024') => {
  switch (timeFilter) {
    case 'dia': return 'Hoy';
    case 'mes': return 'Este Mes';
    case 'año': return `Año ${yearFilter}`;
    default: return 'Este período';
  }
};

/**
 * Obtiene etiqueta del período para el header
 */
export const getPeriodLabel = (timeFilter, yearFilter = '2024') => {
  switch (timeFilter) {
    case 'dia': return 'Vista Diaria';
    case 'mes': return 'Vista Mensual';
    case 'año': return `Año ${yearFilter}`;
    default: return 'Vista Actual';
  }
};