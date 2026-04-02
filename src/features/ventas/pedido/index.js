// src/features/ventas/pedido/index.js

/**
 * Módulo de Pedidos
 */

// Pages
export { default as Pedidos } from "./pages/Pedidos";
export { default as CrearPedido } from "./pages/CrearPedido";
export { default as EditarPedido } from "./pages/EditarPedido";
export { default as DetallePedido } from "./pages/DetallePedido";

// Components
export { default as PedidoForm } from "./components/PedidoForm";

// Hooks
export { usePedidos } from "./hooks/usePedidos";
export { usePedidoForm } from "./hooks/usePedidoForm";

// Services
export * as pedidosService from "./services/pedidosService";

// Utils
export * as pedidosUtils from "./utils/pedidosUtils";