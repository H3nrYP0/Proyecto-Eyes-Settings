/**
 * Módulo de Proveedores
 */

// Pages
export { default as Proveedores } from "./pages/Proveedores";
export { default as CrearProveedor } from "./pages/CrearProveedor";
export { default as EditarProveedor } from "./pages/EditarProveedor";
export { default as DetalleProveedor } from "./pages/DetalleProveedor";

// Components
export { default as ProveedorForm } from "./components/ProveedorForm";

// Hooks
export { useProveedores } from "./hooks/useProveedores";
export { useProveedorForm } from "./hooks/useProveedorForm";

// Services
export * as proveedoresService from "./services/proveedoresService";

// Utils
export * as proveedoresUtils from "./utils/proveedoresUtils";