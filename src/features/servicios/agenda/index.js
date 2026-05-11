/**
 * Módulo de Agenda
 */

// Pages
export { default as Agenda } from "./pages/Agenda";

// Components
export { default as AgendaCalendar } from "./components/AgendaCalendar";

// Hooks
export { useAgenda } from "./hooks/useAgenda";

// Context (stub — datos migrados a React Query)
export { AgendaDataProvider } from "./context/AgendaDataContext";

// Services
export * as agendaService from "./services/agendaService";

// Utils
export * as agendaUtils from "./utils/agendaUtils";