import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";

import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";

import Dashboard from "../../../features/dashboard/Dashboard";

// VENTAS
import { Ventas, DetalleVenta, EditarVenta } from "../../../features/ventas/venta";
import { 
  Clientes, 
  CrearCliente, 
  EditarCliente, 
  DetalleCliente, 
  HistorialFormula 
} from "../../../features/ventas/cliente";
import { 
  Pedidos, 
  CrearPedido, 
  EditarPedido, 
  DetallePedido 
} from "../../../features/ventas/pedido";

// NOTA: Abonos ya NO tiene rutas separadas - está integrado como modal dentro de Pedidos

// ========== COMPRAS (sin cambios) ==========
import {
  Compras,
  CrearCompra,
  EditarCompra,
  DetalleCompra,
  CompraPDFView,
} from "../../../features/compras/compra";

import { Marcas } from "../../../features/compras/marca";

import { Categorias } from "../../../features/compras/categoria";

import {
  Productos,
  CrearProducto,
  EditarProducto,
  DetalleProducto,
} from "../../../features/compras/producto";

import {
  Proveedores,
  CrearProveedor,
  EditarProveedor,
  DetalleProveedor,
} from "../../../features/compras/proveedor";

// ========== SERVICIOS (sin cambios) ==========
import { Servicios } from "../../../features/servicios/servicio";

import {
  Empleados,
  CrearEmpleado,
  EditarEmpleado,
  DetalleEmpleado,
} from "../../../features/servicios/empleado";

import {
  Citas,
  CrearCita,
  EditarCita,
  DetalleCita,
} from "../../../features/servicios/cita";

import { Horarios } from "../../../features/servicios/horario";
import { Agenda } from "../../../features/servicios/agenda";

import CampanasSalud from "../../../features/servicios/campanaSalud/CampanasSalud";
import CrearCampanaSalud from "../../../features/servicios/campanaSalud/CrearCampanaSalud";
import EditarCampanaSalud from "../../../features/servicios/campanaSalud/EditarCampanaSalud";
import DetalleCampanaSalud from "../../../features/servicios/campanaSalud/DetalleCampanaSalud";

// ========== SEGURIDAD (sin cambios) ==========
import Roles from "../../../features/seguridad/Roles";
import CrearRol from "../../../features/seguridad/roles/CrearRol";
import EditarPermisos from "../../../features/seguridad/roles/EditarPermisos";
import ListaRoles from "../../../features/seguridad/roles/ListaRoles";

import GestionUsuarios from "../../../features/seguridad/GestionUsuarios";
import CrearUsuario from "../../../features/seguridad/usuario/CrearUsuario";
import EditarUsuario from "../../../features/seguridad/usuario/EditarUsuario";
import DetalleUsuario from "../../../features/seguridad/usuario/DetalleUsuario";

// ========== CONFIGURACIÓN ==========
import Configuracion from "../../../features/configuracion/Configuration";
import authService from "../../../features/auth/Services/authService";

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
    authService.logout();              
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

          {/* ========== VENTAS ========== */}
          <Route path="ventas">
            <Route index element={<Ventas />} />
            
            {/* Clientes */}
            <Route path="clientes">
              <Route index element={<Clientes />} />
              <Route path="crear" element={<CrearCliente />} />
              <Route path="editar/:id" element={<EditarCliente />} />
              <Route path="detalle/:id" element={<DetalleCliente />} />
              <Route path="historial-formula/:id" element={<HistorialFormula />} />
            </Route>

            {/* Pedidos */}
            <Route path="pedidos">
              <Route index element={<Pedidos />} />
              <Route path="crear" element={<CrearPedido />} />
              <Route path="editar/:id" element={<EditarPedido />} />
              <Route path="detalle/:id" element={<DetallePedido />} />
            </Route>

            {/* Ventas (creación automática desde pedidos) */}
            
            <Route path="detalle/:id" element={<DetalleVenta />} />
            <Route path="editar/:id" element={<EditarVenta />} />
            
            {/* NOTA: La ruta de Abonos ha sido eliminada porque ahora está integrada como modal dentro de Pedidos */}
          </Route>

          {/* ========== COMPRAS ========== */}
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

          {/* ========== SERVICIOS ========== */}
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

            <Route path="horarios" element={<Horarios />} />

            <Route path="agenda" element={<Agenda />} />
            <Route path="agenda/horarios" element={<Horarios />} />

            <Route path="campanas-salud" element={<CampanasSalud />} />
            <Route path="campanas-salud/crear" element={<CrearCampanaSalud />} />
            <Route path="campanas-salud/editar/:id" element={<EditarCampanaSalud />} />
            <Route path="campanas-salud/detalle/:id" element={<DetalleCampanaSalud />} />
          </Route>

          {/* ========== SEGURIDAD ========== */}
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

          {/* ========== CONFIGURACIÓN ========== */}
          <Route path="configuracion" element={<Configuracion user={user} />} />

          {/* ========== 404 ========== */}
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