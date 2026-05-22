/**
 * Módulo de Compras
 */

// Pages
export { default as Compras       } from "./pages/Compras";
export { default as CrearCompra   } from "./pages/CrearCompra";
export { default as DetalleCompra } from "./pages/DetalleCompra";
export { default as CompraPDFView } from "./pages/CompraPDFView";

// Components
export { default as ComprasForm } from "./components/ComprasForm";

// Services
export * as comprasService from "./services/comprasService";

// Utils
export * as comprasUtils from "./utils/comprasUtils";