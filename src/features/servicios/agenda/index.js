/**
 * Módulo de Agenda
 * 
 * Este módulo gestiona el calendario de citas, horarios y novedades.
 * Utiliza React Query para el manejo de datos y caché compartida.
 */

// ============================
// RE-EXPORTAR SERVICIOS Y UTILS como named exports
// ============================
export * from './services/agendaService';
export * from './utils/agendaUtils';

// ============================
// PAGES
// ============================
export { default as Agenda } from "./pages/Agenda";

// ============================
// COMPONENTS
// ============================
export { default as AgendaCalendar } from "./components/AgendaCalendar";

// ============================
// HOOKS
// ============================
export { useAgenda } from "./hooks/useAgenda";

// ============================
// CONTEXT (stub - ya no se usa, se mantiene por compatibilidad)
// ============================
export { AgendaDataProvider } from "./context/AgendaDataContext";

// ============================
// NAMESPACES (compatibilidad con importaciones antiguas)
// ============================
export * as agendaService from "./services/agendaService";
export * as agendaUtils from "./utils/agendaUtils";