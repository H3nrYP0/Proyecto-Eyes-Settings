import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Toolbar } from "@mui/material";

// LAYOUT COMPONENTS
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";

// FEATURES - DASHBOARD
import Dashboard from "../../../features/dashboard/Dashboard";

// FEATURES - VENTAS
import Ventas from "../../../features/ventas/pages/Ventas";
import Clientes from "../../../features/ventas/pages/Clientes";
import Pedidos from "../../../features/ventas/pages/Pedidos";
import Abonos from "../../../features/ventas/pages/Abonos";

import NuevaVenta from "../../../features/ventas/components/ventas/NuevaVenta";
import EditarVenta from "../../../features/ventas/components/ventas/EditarVenta";
import DetalleVenta from "../../../features/ventas/components/ventas/DetalleVenta";

import CrearCliente from "../../../features/ventas/components/clientes/CrearCliente";
import EditarCliente from "../../../features/ventas/components/clientes/EditarCliente";
import DetalleCliente from "../../../features/ventas/components/clientes/DetalleCliente";
import HistorialFormula from "../../../features/ventas/components/clientes/HistorialFormula";

import NuevoAbono from "../../../features/ventas/components/abonos/NuevoAbono";
import DetalleAbono from "../../../features/ventas/components/abonos/DetalleAbono";
import EditarAbono from "../../../features/ventas/components/abonos/EditarAbono";

import CrearPedido from "../../../features/ventas/components/pedidos/CrearPedido";
import DetallePedido from "../../../features/ventas/components/pedidos/DetallePedido";
import EditarPedido from "../../../features/ventas/components/pedidos/EditarPedido";

// FEATURES - COMPRAS
import Compras from "../../../features/compras/pages/Compras";
import CrearCompra from "../../../features/compras/pages/CrearCompra";
import EditarCompra from "../../../features/compras/pages/EditarCompra";
import DetalleCompra from "../../../features/compras/pages/DetalleCompra";
import CompraPDFView from "../../../features/compras/pages/CompraPDFView";

import Categorias from "../../../features/compras/pages/categoria/Categorias";
import CrearCategoria from "../../../features/compras/pages/categoria/CrearCategoria";
import EditarCategoria from "../../../features/compras/pages/categoria/EditarCategoria";
import DetalleCategoria from "../../../features/compras/pages/categoria/DetalleCategoria";

import Marcas from "../../../features/compras/pages/marca/Marcas";
import CrearMarca from "../../../features/compras/pages/marca/CrearMarca";
import EditarMarca from "../../../features/compras/pages/marca/EditarMarca";
import DetalleMarca from "../../../features/compras/pages/marca/DetalleMarca";

import Products from "../../../features/compras/pages/producto/Products";
import CrearProducto from "../../../features/compras/pages/producto/CrearProducto";
import DetalleProducto from "../../../features/compras/pages/producto/DetalleProducto";
import EditarProducto from "../../../features/compras/pages/producto/EditarProducto";

import Proveedores from "../../../features/compras/pages/Proveedores";
import CrearProveedor from "../../../features/compras/pages/CrearProveedor";
import EditarProveedor from "../../../features/compras/pages/EditarProveedor";
import DetalleProveedor from "../../../features/compras/pages/DetalleProveedor";

// FEATURES - SERVICIOS
import Servicios from "../../../features/servicios/pages/servicio/Servicios";
import CrearServicio from "../../../features/servicios/pages/servicio/CrearServicio";
import EditarServicio from "../../../features/servicios/pages/servicio/EditarServicio";
import DetalleServicio from "../../../features/servicios/pages/servicio/DetalleServicio";

import Empleados from "../../../features/servicios/pages/empleado/Empleados";
import CrearEmpleado from "../../../features/servicios/pages/empleado/CrearEmpleado";
import EditarEmpleado from "../../../features/servicios/pages/empleado/EditarEmpleado";
import DetalleEmpleado from "../../../features/servicios/pages/empleado/DetalleEmpleado";

import Agenda from "../../../features/servicios/pages/agenda/Agenda";
import CrearAgenda from "../../../features/servicios/pages/agenda/CrearAgenda";
import EditarAgenda from "../../../features/servicios/pages/agenda/EditarAgenda";
import DetalleAgenda from "../../../features/servicios/pages/agenda/DetalleAgenda";

import Horarios from "../../../features/servicios/pages/horario/Horarios";

import CampanasSalud from "../../../features/servicios/pages/campanaSalud/CampanasSalud";
import CrearCampanaSalud from "../../../features/servicios/pages/campanaSalud/CrearCampanaSalud";
import EditarCampanaSalud from "../../../features/servicios/pages/campanaSalud/EditarCampanaSalud";
import DetalleCampanaSalud from "../../../features/servicios/pages/campanaSalud/DetalleCampanaSalud";

// SEGURIDAD
import Roles from "../../../features/seguridad/pages/Roles";
import CrearRol from "../../../features/seguridad/pages/roles/CrearRol";
import EditarPermisos from "../../../features/seguridad/pages/roles/EditarPermisos";
import ListaRoles from "../../../features/seguridad/pages/roles/ListaRoles";

import GestionUsuarios from "../../../features/seguridad/pages/GestionUsuarios";
import CrearUsuario from "../../../features/seguridad/pages/usuario/CrearUsuario";
import EditarUsuario from "../../../features/seguridad/pages/usuario/EditarUsuario";
import DetalleUsuario from "../../../features/seguridad/pages/usuario/DetalleUsuario";

// CONFIGURACIÓN
import Configuracion from "../../../features/configuracion/Configuration";

import { ROLES } from "../../../shared/constants/roles";

export default function OpticaDashboardLayout({ user, setUser }) {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const dashboardRoles = [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.VENDEDOR,
    ROLES.OPTICO
  ];

  if (!dashboardRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ display: "flex" }}>

      <AppHeader
        onToggleSidebar={handleToggleSidebar}
        user={user}
        onLogout={handleLogout}
      />

      <Sidebar
        open={sidebarOpen}
        user={user}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          backgroundColor: "#f8fafc"
        }}
      >
        <Toolbar />

        <Routes>

          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* ================= VENTAS ================= */}
          <Route path="ventas">
            <Route index element={<Ventas />} />

            <Route path="clientes">
              <Route index element={<Clientes />} />
              <Route path="crear" element={<CrearCliente />} />
              <Route path="editar/:id" element={<EditarCliente />} />
              <Route path="detalle/:id" element={<DetalleCliente />} />
              <Route path="historial-formula/:id" element={<HistorialFormula />} />
            </Route>

            <Route path="abonos">
              <Route index element={<Abonos />} />
              <Route path="nuevo" element={<NuevoAbono />} />
              <Route path="editar" element={<EditarAbono />} />
              <Route path="detalle" element={<DetalleAbono />} />
            </Route>

            <Route path="pedidos">
              <Route index element={<Pedidos />} />
              <Route path="crear" element={<CrearPedido />} />
              <Route path="editar/:id" element={<EditarPedido />} />
              <Route path="detalle/:id" element={<DetallePedido />} />
            </Route>

            <Route path="nueva" element={<NuevaVenta />} />
            <Route path="detalle/:id" element={<DetalleVenta />} />
            <Route path="editar/:id" element={<EditarVenta />} />
          </Route>

          {/* ================= COMPRAS ================= */}
          <Route path="compras">
            <Route index element={<Compras />} />
            <Route path="crear" element={<CrearCompra />} />
            <Route path="editar/:id" element={<EditarCompra />} />
            <Route path="detalle/:id" element={<DetalleCompra />} />
            <Route path="detalle/:id/pdf" element={<CompraPDFView />} />

            <Route path="categorias">
              <Route index element={<Categorias />} />
              <Route path="crear" element={<CrearCategoria />} />
              <Route path="editar/:id" element={<EditarCategoria />} />
              <Route path="detalle/:id" element={<DetalleCategoria />} />
            </Route>

            <Route path="marcas">
              <Route index element={<Marcas />} />
              <Route path="crear" element={<CrearMarca />} />
              <Route path="editar/:id" element={<EditarMarca />} />
              <Route path="detalle/:id" element={<DetalleMarca />} />
            </Route>

            <Route path="productos" element={<Products />} />
            <Route path="productos/crear" element={<CrearProducto />} />
            <Route path="productos/editar/:id" element={<EditarProducto />} />
            <Route path="productos/detalle/:id" element={<DetalleProducto />} />

            <Route path="proveedores">
              <Route index element={<Proveedores />} />
              <Route path="crear" element={<CrearProveedor />} />
              <Route path="editar/:id" element={<EditarProveedor />} />
              <Route path="detalle/:id" element={<DetalleProveedor />} />
            </Route>
          </Route>

          {/* ================= SERVICIOS ================= */}
          <Route path="servicios">
            <Route index element={<Servicios />} />
            <Route path="crear" element={<CrearServicio />} />
            <Route path="editar/:id" element={<EditarServicio />} />
            <Route path="detalle/:id" element={<DetalleServicio />} />

            <Route path="empleados" element={<Empleados />} />
            <Route path="empleados/crear" element={<CrearEmpleado />} />
            <Route path="empleados/editar/:id" element={<EditarEmpleado />} />
            <Route path="empleados/detalle/:id" element={<DetalleEmpleado />} />
            <Route path="empleados/horarios/:id" element={<Horarios />} />

            <Route path="agenda" element={<Agenda />} />
            <Route path="agenda/crear" element={<CrearAgenda />} />
            <Route path="agenda/editar/:id" element={<EditarAgenda />} />
            <Route path="agenda/detalle/:id" element={<DetalleAgenda />} />

            <Route path="horarios" element={<Horarios />} />

            <Route path="campanas-salud" element={<CampanasSalud />} />
            <Route path="campanas-salud/crear" element={<CrearCampanaSalud />} />
            <Route path="campanas-salud/editar/:id" element={<EditarCampanaSalud />} />
            <Route path="campanas-salud/detalle/:id" element={<DetalleCampanaSalud />} />
          </Route>

          {/* ================= SEGURIDAD ================= */}
          <Route path="seguridad">
            <Route path="usuarios">
              <Route index element={<GestionUsuarios />} />
              <Route path="crear" element={<CrearUsuario />} />
              <Route path="editar/:id" element={<EditarUsuario />} />
              <Route path="detalle/:id" element={<DetalleUsuario />} />
            </Route>

            <Route path="roles">
              <Route index element={<Roles />} />
              <Route path="crear" element={<CrearRol />} />
              <Route path="editar/:id" element={<EditarPermisos />} />
              <Route path="detalle/:id" element={<ListaRoles />} />
            </Route>

            <Route index element={<Navigate to="usuarios" replace />} />
          </Route>

          {/* ================= CONFIGURACIÓN ================= */}
          <Route path="configuracion" element={<Configuracion user={user} />} />

          {/* ================= 404 ================= */}
          <Route
            path="*"
            element={
              <Box textAlign="center" mt={5}>
                <h2>Página no encontrada</h2>
                <p>La página que buscas no existe en el sistema.</p>
              </Box>
            }
          />

        </Routes>
      </Box>
    </Box>
  );
}
