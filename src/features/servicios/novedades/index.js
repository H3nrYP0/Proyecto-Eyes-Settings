// src/features/servicios/novedades/index.js

// Re-exportar servicios y utils
export * from './services/novedadesService';
export * from './utils/novedadesUtils';

// Pages
export { default as Novedades } from './pages/Novedades';

// Components
export { default as NovedadForm } from './components/NovedadForm';

// Hooks
export { useNovedades } from './hooks/useNovedades';
export { useNovedadForm } from './hooks/useNovedadForm';

// Namespaces (compatibilidad)
export * as novedadesService from './services/novedadesService';
export * as novedadesUtils from './utils/novedadesUtils';