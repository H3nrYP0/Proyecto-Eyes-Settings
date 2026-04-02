// src/features/ventas/cliente/index.js

export { default as Clientes } from "./pages/Clientes";
export { default as CrearCliente } from "./pages/CrearCliente";
export { default as EditarCliente } from "./pages/EditarCliente";
export { default as DetalleCliente } from "./pages/DetalleCliente";
export { default as HistorialFormula } from "./pages/HistorialFormula";
export { default as ClienteForm } from "./components/ClienteForm";
export { useClientes } from "./hooks/useClientes";
export { useClienteForm } from "./hooks/useClienteForm";
export * as clientesService from "./services/clientesService";
export * as clientesUtils from "./utils/clientesUtils";