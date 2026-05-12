// ============================
// RE-EXPORTAR SERVICIOS Y UTILS
// ============================
export * from './services/horariosService';
export * from './utils/horariosUtils';

// Pages
export { default as Horarios } from './pages/Horarios';

// Components
export { default as HorarioForm } from './components/HorarioForm';

// Hooks
export { useHorarios } from './hooks/useHorarios';
export { useHorarioForm } from './hooks/useHorarioForm';

// Namespaces (compatibilidad)
export * as horariosService from './services/horariosService';
export * as horariosUtils from './utils/horariosUtils';