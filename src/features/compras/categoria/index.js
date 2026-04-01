/**
 * Módulo de Categorías
 * 
 * Este módulo maneja la gestión de categorías de productos
 * Utiliza modales para crear, editar y ver detalles
 */

// Pages
export { default as Categorias } from "./pages/Categorias";

// Components
export { default as CategoriaForm } from "./components/CategoriaForm";

// Hooks
export { useCategorias } from "./hooks/useCategorias";
export { useCategoriaForm } from "./hooks/useCategoriaForm";

// Services
export * as categoriasService from "./services/categoriasService";

// Utils (para futuros helpers)
// export * as categoriasUtils from "./utils/categoriasUtils";