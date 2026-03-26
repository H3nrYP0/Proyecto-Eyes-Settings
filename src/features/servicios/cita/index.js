/**
 * Módulo de Citas
 * 
 * Este módulo maneja la gestión de citas médicas
 * Incluye verificación de disponibilidad en tiempo real
 */

// Pages
export { default as Citas } from "./pages/Citas";
export { default as CrearCita } from "./pages/CrearCita";
export { default as EditarCita } from "./pages/EditarCita";
export { default as DetalleCita } from "./pages/DetalleCita";

// Components
export { default as CitaForm } from "./components/CitaForm";

// Hooks
export { useCitas } from "./hooks/useCitas";
export { useCitaForm } from "./hooks/useCitaForm";
export { useDisponibilidad } from "./hooks/useDisponibilidad";

// Services
export * as citasService from "./services/citasService";

// Utils
export * as citasUtils from "./utils/citasUtils";