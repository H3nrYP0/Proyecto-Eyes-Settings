// src/features/compras/pages/producto/index.js
export { default as Productos } from "./pages/Productos";
export { default as CrearProducto } from "./pages/CrearProducto";
export { default as EditarProducto } from "./pages/EditarProducto";
export { default as DetalleProducto } from "./pages/DetalleProducto";

export { default as ProductoForm } from "./components/ProductoForm";
export { default as StockCell } from "./components/StockCell";

export { useProductos } from "./hooks/useProductos";
export { useProductoForm } from "./hooks/useProductoForm";
export { useChatBot } from "./hooks/useChatBot";

export * as productosService from "./services/productosService";