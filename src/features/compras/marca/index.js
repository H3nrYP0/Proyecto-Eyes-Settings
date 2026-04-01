/**
 * Módulo de Marcas
 * 
 * Este módulo maneja la gestión de marcas de productos
 * Utiliza modales para crear, editar y ver detalles
 */

// Pages
export { default as Marcas } from "./pages/Marcas";

// Components
export { default as MarcaForm } from "./components/MarcaForm";

// Hooks
export { useMarcas } from "./hooks/useMarcas";
export { useMarcaForm } from "./hooks/useMarcaForm";

// Services
export * as marcasService from "./services/marcasService";

// Utils
export * as marcasUtils from "./utils/marcasUtils";