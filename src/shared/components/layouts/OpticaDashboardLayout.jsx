// RESPONSABILIDAD: Layout principal del panel de administración
//
//   - Contiene la estructura base: AppHeader (barra superior) + Sidebar (menú lateral)
//   - Maneja la navegación entre todas las rutas del dashboard
//   - Gestiona el estado de la sesión del usuario (login/logout)
//   - Actualiza el usuario cuando se edita el perfil (onUserUpdate)
//   - Es responsive: en móvil el sidebar se vuelve temporal
//
// PROPS:
//   user     — objeto usuario del JWT (nombre, rol, permisos)
//   setUser  — función para actualizar el estado del usuario

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";

import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";

import Dashboard from "../../../features/dashboard/Dashboard";

// VENTAS
import { Ventas, DetalleVenta } from "../../../features/ventas/venta";
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

// ========== Compras ==========
import {
  Compras,
  CrearCompra,
  EditarCompra,
  DetalleCompra,
  CompraPDFView,
} from "../../../features/compras/compra";

import { Marcas } from "../../../features/compras/marca";

import { Categorias } from "../../../features/compras/categoria";

// ========== Productos ==========
import {
  Productos,
  CrearProducto,
  EditarProducto,
  DetalleProducto,
} from "../../../features/compras/producto";

// ========== Proveedores ==========
import {
  Proveedores,
  CrearProveedor,
  EditarProveedor,
  DetalleProveedor,
} from "../../../features/compras/proveedor";

// ========== Servicios ==========
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
import { CitaDataProvider } from '../../../features/servicios/cita/context/CitaDataContext';
import { Outlet } from 'react-router-dom';

import { Horarios } from "../../../features/servicios/horario";
import { AgendaDataProvider } from '../../../features/servicios/agenda/context/AgendaDataContext';
import { Agenda } from "../../../features/servicios/agenda";
import { Novedades } from "../../../features/servicios/novedades";

import { 
  CampanasSalud, 
  CrearCampanaSalud, 
  EditarCampanaSalud, 
  DetalleCampanaSalud 
} from "@servicios/campanaSalud";

// ========== Seguridad ==========
import Roles from "@seguridad/roles/pages/Roles";
import CrearRol from "@seguridad/roles/pages/CrearRol";
import EditarPermisos from "@seguridad/roles/pages/EditarPermisos";
import ListaRoles from "@seguridad/roles/pages/ListaRoles";

import GestionUsuarios from "@seguridad/user/pages/GestionUsuarios";
import CrearUsuario from "@seguridad/user/pages/CrearUsuario";
import EditarUsuario from "@seguridad/user/pages/EditarUsuario";
import DetalleUsuario from "@seguridad/user/pages/DetalleUsuario";

// ========== Configuración ==========
import Configuracion from "@configuracion/pages/Configuration";
import authServices from "@auth/services/authServices";

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
    authServices.logout();              
    setUser(null);
    navigate("/login", { replace: true });
  };

  // Actualizar usuario después de editar el perfil
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
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

            {/* Ventas — solo lectura, se generan desde pedidos */}
            <Route path="detalle/:id" element={<DetalleVenta />} />
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
              <Route element={<CitaDataProvider><Outlet /></CitaDataProvider>}>
                <Route index element={<Citas />} />
                <Route path="crear" element={<CrearCita />} />
                <Route path="editar/:id" element={<EditarCita />} />
                <Route path="detalle/:id" element={<DetalleCita />} />
                <Route path="novedades" element={<Novedades />} />
              </Route>
              
            </Route>

            <Route path="empleados" element={<Empleados />} />
            <Route path="empleados/crear" element={<CrearEmpleado />} />
            <Route path="empleados/editar/:id" element={<EditarEmpleado />} />
            <Route path="empleados/detalle/:id" element={<DetalleEmpleado />} />
            <Route path="empleados/horarios/:id" element={<Horarios />} />

            <Route path="horarios" element={<Horarios />} />

            <Route path="agenda">
              <Route element={<AgendaDataProvider><Outlet /></AgendaDataProvider>}>
                <Route index element={<Agenda />} />
                <Route path="horarios" element={<Horarios />} />
              </Route>
            </Route>

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
          <Route 
            path="configuracion" 
            element={
              <Configuracion 
                user={user} 
                onUserUpdate={handleUserUpdate}
              />
            } 
          />

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