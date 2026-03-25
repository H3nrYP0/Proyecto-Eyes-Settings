// src/features/servicios/index.js
/**
 * Módulo de Servicios
 * 
 * Este módulo maneja la gestión de servicios de la óptica
 * Utiliza modales para crear, editar y ver detalles
 */

// Pages
export { default as Servicios } from "./pages/Servicios";

// Components
export { default as ServicioForm } from "./components/ServicioForm";

// Hooks
export { useServicios } from "./hooks/useServicios";
export { useServicioForm } from "./hooks/useServicioForm";

// Services
export * as serviciosService from "./services/serviciosService";

// Utils (si los hay)
// export * as serviciosUtils from "./utils/serviciosUtils";