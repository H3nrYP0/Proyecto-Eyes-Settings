// src/features/ventas/venta/index.js
export { default as Ventas }       from "./pages/Ventas";
export { default as DetalleVenta } from "./pages/DetalleVenta";
export { useVentas }               from "./hooks/useVentas";
export * as ventasService          from "./services/ventasService";
export * as ventasUtils            from "./utils/ventasUtils";