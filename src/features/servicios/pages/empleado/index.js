/**
 * Módulo de Empleados
 * 
 * Este módulo maneja la gestión de empleados
 * Utiliza páginas separadas para crear, editar y ver detalles
 */

// Pages
export { default as Empleados } from "./pages/Empleados";
export { default as CrearEmpleado } from "./pages/CrearEmpleado";
export { default as EditarEmpleado } from "./pages/EditarEmpleado";
export { default as DetalleEmpleado } from "./pages/DetalleEmpleado";

// Components
export { default as EmpleadoForm } from "./components/EmpleadoForm";

// Hooks
export { useEmpleados } from "./hooks/useEmpleados";
export { useEmpleadoForm } from "./hooks/useEmpleadoForm";

// Services
export * as empleadosService from "./services/empleadosService";

// Utils
export * as empleadosUtils from "./utils/empleadosUtils";