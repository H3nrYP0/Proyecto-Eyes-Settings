import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";

import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";

import Dashboard from "../../../features/dashboard/Dashboard";
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

import Compras from "../../../features/compras/pages/Compras";
import CrearCompra from "../../../features/compras/pages/CrearCompra";
import EditarCompra from "../../../features/compras/pages/EditarCompra";
import DetalleCompra from "../../../features/compras/pages/DetalleCompra";
import CompraPDFView from "../../../features/compras/pages/CompraPDFView";

import Marcas from "../../../features/compras/pages/marca/pages/Marcas";

import { Categorias } from "../../../features/compras/pages/categoria";

import Productos from "../../../features/compras/pages/producto/pages/Productos";
import CrearProducto from "../../../features/compras/pages/producto/pages/CrearProducto";
import DetalleProducto from "../../../features/compras/pages/producto/pages/DetalleProducto";
import EditarProducto from "../../../features/compras/pages/producto/pages/EditarProducto";

import Proveedores from "../../../features/compras/pages/Proveedores";
import CrearProveedor from "../../../features/compras/pages/CrearProveedor";
import EditarProveedor from "../../../features/compras/pages/EditarProveedor";
import DetalleProveedor from "../../../features/compras/pages/DetalleProveedor";

import { Servicios } from "../../../features/servicios/servicio";

import {
  Empleados,
  CrearEmpleado,
  EditarEmpleado,
  DetalleEmpleado,
} from "../../../features/servicios/empleado";

import { Agenda } from "../../../features/servicios/agenda";
import { Horarios } from "../../../features/servicios/horario";

import CampanasSalud from "../../../features/servicios/campanaSalud/CampanasSalud";
import CrearCampanaSalud from "../../../features/servicios/campanaSalud/CrearCampanaSalud";
import EditarCampanaSalud from "../../../features/servicios/campanaSalud/EditarCampanaSalud";
import DetalleCampanaSalud from "../../../features/servicios/campanaSalud/DetalleCampanaSalud";

import {
  Citas,
  CrearCita,
  EditarCita,
  DetalleCita,
} from "../../../features/servicios/cita";

import Roles from "../../../features/seguridad/pages/Roles";
import CrearRol from "../../../features/seguridad/pages/roles/CrearRol";
import EditarPermisos from "../../../features/seguridad/pages/roles/EditarPermisos";
import ListaRoles from "../../../features/seguridad/pages/roles/ListaRoles";

import GestionUsuarios from "../../../features/seguridad/pages/GestionUsuarios";
import CrearUsuario from "../../../features/seguridad/pages/usuario/CrearUsuario";
import EditarUsuario from "../../../features/seguridad/pages/usuario/EditarUsuario";
import DetalleUsuario from "../../../features/seguridad/pages/usuario/DetalleUsuario";

import Configuracion from "../../../features/configuracion/Configuration";

const drawerWidth = 240;

export default function OpticaDashboardLayout({ user, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ display: "flex", width: "100vw", overflow: "hidden" }}>

      <AppHeader
        onToggleSidebar={handleToggleSidebar}
        user={user}
        onLogout={handleLogout}
      />

      <Sidebar
        open={sidebarOpen}
        onToggle={handleToggleSidebar}
        user={user}
      />

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          overflow: "hidden",
          p: { xs: 1, sm: 2, md: 3 },
          mt: 8,
          transition: "margin 0.3s ease",
        }}
      >
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

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

          <Route path="compras">
            <Route index element={<Compras />} />
            <Route path="crear" element={<CrearCompra />} />
            <Route path="editar/:id" element={<EditarCompra />} />
            <Route path="detalle/:id" element={<DetalleCompra />} />
            <Route path="detalle/:id/pdf" element={<CompraPDFView />} />
            <Route path="categorias">
              <Route index element={<Categorias />} />
            </Route>
            <Route path="marcas">
              <Route index element={<Marcas />} />
            </Route>
            <Route path="productos" element={<Productos />} />
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

          <Route path="servicios">
            <Route index element={<Servicios />} />
      
            <Route path="citas">
              <Route index element={<Citas />} />
              <Route path="crear" element={<CrearCita />} />
              <Route path="editar/:id" element={<EditarCita />} />
              <Route path="detalle/:id" element={<DetalleCita />} />
            </Route>

            <Route path="empleados" element={<Empleados />} />
            <Route path="empleados/crear" element={<CrearEmpleado />} />
            <Route path="empleados/editar/:id" element={<EditarEmpleado />} />
            <Route path="empleados/detalle/:id" element={<DetalleEmpleado />} />

            <Route path="empleados/horarios/:id" element={<Horarios />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="agenda/horarios" element={<Horarios />} />
            <Route path="horarios" element={<Horarios />} />
            
            <Route path="campanas-salud" element={<CampanasSalud />} />
            <Route path="campanas-salud/crear" element={<CrearCampanaSalud />} />
            <Route path="campanas-salud/editar/:id" element={<EditarCampanaSalud />} />
            <Route path="campanas-salud/detalle/:id" element={<DetalleCampanaSalud />} />
          </Route>

          <Route path="seguridad">
            <Route index element={<Navigate to="usuarios" replace />} />
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
          </Route>

          <Route path="configuracion" element={<Configuracion user={user} />} />

          <Route
            path="*"
            element={
              <div className="not-found-page">
                <div className="not-found-content">
                  <h2>Página no encontrada</h2>
                  <p>La página que buscas no existe en el sistema.</p>
                  <button className="btn-primary" onClick={() => window.history.back()}>
                    Volver atrás
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </Box>

    </Box>
  );
}