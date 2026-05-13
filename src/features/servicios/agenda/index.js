/**
 * Módulo de Agenda
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
// CONTEXT (stub)
// ============================
export { AgendaDataProvider } from "./context/AgendaDataContext";

// ============================
// NAMESPACES (opcional, por compatibilidad)
// ============================
export * as agendaService from "./services/agendaService";
export * as agendaUtils from "./utils/agendaUtils";