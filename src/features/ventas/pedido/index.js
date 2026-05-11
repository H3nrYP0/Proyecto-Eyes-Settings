// src/features/ventas/pedido/index.js

export { default as Pedidos }        from "./pages/Pedidos";
export { default as CrearPedido }    from "./pages/CrearPedido";
export { default as EditarPedido }   from "./pages/EditarPedido";
export { default as DetallePedido }  from "./pages/DetallePedido";
export { default as PedidoPDFView }  from "./pages/PedidoPDFView";

export { default as PedidoForm }     from "./components/PedidoForm";

export { usePedidos }                from "./hooks/usePedidos";
export { usePedidoForm }             from "./hooks/usePedidoForm";

export * as pedidosService           from "./services/pedidosService";
export * as pedidosUtils             from "./utils/pedidosUtils";