/**
 * Layout principal del panel administrativo.
 * - Incluye Sidebar y AppHeader.
 * - Filtra las rutas según permisos del usuario.
 * - La ruta raíz ("/admin") redirige al primer módulo que el usuario tenga permiso.
 * - Si tiene "ver_dashboard" va al dashboard, sino al primer módulo disponible (ventas, citas, etc.)
 */

import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";

import Dashboard from "../../../features/dashboard/Dashboard";

// VENTAS
import { Ventas, CrearVenta, DetalleVenta } from "../../../features/ventas/venta";
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
  DetallePedido,
  PedidoPDFView,
} from "../../../features/ventas/pedido";

// ========== Compras ==========
import {
  Compras,
  CrearCompra,
  DetalleCompra,
  CompraPDFView,
} from "../../../features/compras/compra";
import { Marcas }      from "../../../features/compras/marca";
import { Categorias }  from "../../../features/compras/categoria";

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
import { Agenda }    from "../../../features/servicios/agenda";
import { Novedades } from "../../../features/servicios/novedades";
import { 
  CampanasSalud, 
  CrearCampanaSalud, 
  EditarCampanaSalud, 
  DetalleCampanaSalud 
} from "@servicios/campanaSalud";

// ========== Seguridad ==========
import Roles          from "@seguridad/roles/pages/Roles";
import CrearRol       from "@seguridad/roles/pages/CrearRol";
import EditarPermisos from "@seguridad/roles/pages/EditarPermisos";
import ListaRoles     from "@seguridad/roles/pages/ListaRoles";
import GestionUsuarios from "@seguridad/user/pages/GestionUsuarios";
import CrearUsuario   from "@seguridad/user/pages/CrearUsuario";
import EditarUsuario  from "@seguridad/user/pages/EditarUsuario";
import DetalleUsuario from "@seguridad/user/pages/DetalleUsuario";

// ========== Configuración ==========
import Configuracion from "@configuracion/pages/Configuration";
import authServices  from "@auth/services/authServices";

// Mapeo de rutas según permisos (para la redirección inicial)
const ROUTE_PERMISSION_MAP = [
  { path: "dashboard", permiso: "ver_dashboard" },
  { path: "ventas", permiso: "ver_ventas" },
  { path: "ventas/clientes", permiso: "ver_clientes" },
  { path: "ventas/pedidos", permiso: "ver_pedidos" },
  { path: "compras", permiso: "ver_compras" },
  { path: "compras/productos", permiso: "ver_productos" },
  { path: "servicios/citas", permiso: "ver_citas" },
  { path: "servicios/empleados", permiso: "ver_empleados" },
  { path: "servicios/campanas-salud", permiso: "ver_citas" },
  { path: "seguridad/usuarios", permiso: "ver_usuarios" },
  { path: "seguridad/roles", permiso: "gestionar_configuracion" },
  { path: "configuracion", permiso: "gestionar_configuracion" },
];

export default function OpticaDashboardLayout({ user, setUser, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isMobile) setSidebarOpen(true);
  }, [isMobile]);

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    authServices.logout();
    queryClient.clear();
    setUser(null);
    if (onLogout) onLogout();
    navigate("/login", { replace: true });
  };

  const handleUserUpdate = (updatedUser) => setUser(updatedUser);

  // Determinar la ruta por defecto al entrar a "/admin"
  const getDefaultRoute = useMemo(() => {
    if (!user || !user.permisos) return "dashboard";
    const permisos = user.permisos;
    // Si tiene ver_dashboard, va al dashboard
    if (permisos.includes("ver_dashboard")) return "dashboard";
    // Buscar la primera ruta cuyo permiso tenga
    const firstAllowed = ROUTE_PERMISSION_MAP.find(item => permisos.includes(item.permiso));
    return firstAllowed ? firstAllowed.path : "dashboard";
  }, [user]);

  return (
    <Box sx={{ display: "flex", width: "100vw", overflow: "hidden" }}>
      <AppHeader
        onToggleSidebar={handleToggleSidebar}
        user={user}
        onLogout={handleLogout}
      />
      <Sidebar open={sidebarOpen} onToggle={handleToggleSidebar} user={user} />
      <Box sx={{
        flexGrow: 1, minWidth: 0, overflow: "hidden",
        p: { xs: 1, sm: 2, md: 3 }, mt: 8,
        transition: "margin 0.3s ease",
      }}>
        <Routes>
          {/* Redirección inteligente según permisos */}
          <Route index element={<Navigate to={getDefaultRoute} replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          {/* ========== VENTAS ========== */}
          <Route path="ventas">
            <Route index element={<Ventas />} />
            <Route path="crear"       element={<CrearVenta />} />
            <Route path="detalle/:id" element={<DetalleVenta />} />

            <Route path="clientes">
              <Route index element={<Clientes />} />
              <Route path="crear"                 element={<CrearCliente />} />
              <Route path="editar/:id"            element={<EditarCliente />} />
              <Route path="detalle/:id"           element={<DetalleCliente />} />
              <Route path="historial-formula/:id" element={<HistorialFormula />} />
            </Route>

            <Route path="pedidos">
              <Route index element={<Pedidos />} />
              <Route path="crear"       element={<CrearPedido />} />
              <Route path="editar/:id"  element={<EditarPedido />} />
              <Route path="detalle/:id" element={<DetallePedido />} />
              <Route path="pdf/:id"     element={<PedidoPDFView />} />
            </Route>
          </Route>

          {/* ========== COMPRAS ========== */}
          <Route path="compras">
            <Route index element={<Compras />} />
            <Route path="crear"           element={<CrearCompra />} />
            <Route path="detalle/:id"     element={<DetalleCompra />} />
            <Route path="detalle/:id/pdf" element={<CompraPDFView />} />

            <Route path="categorias"><Route index element={<Categorias />} /></Route>
            <Route path="marcas"><Route index element={<Marcas />} /></Route>

            <Route path="productos"             element={<Productos />} />
            <Route path="productos/crear"       element={<CrearProducto />} />
            <Route path="productos/editar/:id"  element={<EditarProducto />} />
            <Route path="productos/detalle/:id" element={<DetalleProducto />} />

            <Route path="proveedores">
              <Route index element={<Proveedores />} />
              <Route path="crear"       element={<CrearProveedor />} />
              <Route path="editar/:id"  element={<EditarProveedor />} />
              <Route path="detalle/:id" element={<DetalleProveedor />} />
            </Route>
          </Route>

          {/* ========== SERVICIOS ========== */}
          <Route path="servicios">
            <Route index element={<Servicios />} />

            <Route path="citas">
              <Route element={<CitaDataProvider><Outlet /></CitaDataProvider>}>
                <Route index element={<Citas />} />
                <Route path="crear"       element={<CrearCita />} />
                <Route path="editar/:id"  element={<EditarCita />} />
                <Route path="detalle/:id" element={<DetalleCita />} />
                <Route path="novedades"   element={<Novedades />} />
              </Route>
            </Route>

            <Route path="empleados"              element={<Empleados />} />
            <Route path="empleados/crear"        element={<CrearEmpleado />} />
            <Route path="empleados/editar/:id"   element={<EditarEmpleado />} />
            <Route path="empleados/detalle/:id"  element={<DetalleEmpleado />} />
            <Route path="empleados/horarios/:id" element={<Horarios />} />
            <Route path="horarios"               element={<Horarios />} />

            <Route path="agenda">
              <Route element={<AgendaDataProvider><Outlet /></AgendaDataProvider>}>
                <Route index element={<Agenda />} />
                <Route path="horarios" element={<Horarios />} />
              </Route>
            </Route>

            <Route path="campanas-salud"             element={<CampanasSalud />} />
            <Route path="campanas-salud/crear"       element={<CrearCampanaSalud />} />
            <Route path="campanas-salud/editar/:id"  element={<EditarCampanaSalud />} />
            <Route path="campanas-salud/detalle/:id" element={<DetalleCampanaSalud />} />
          </Route>

          {/* ========== SEGURIDAD ========== */}
          <Route path="seguridad">
            <Route index element={<Navigate to="usuarios" replace />} />
            <Route path="usuarios">
              <Route index element={<GestionUsuarios />} />
              <Route path="crear"       element={<CrearUsuario />} />
              <Route path="editar/:id"  element={<EditarUsuario />} />
              <Route path="detalle/:id" element={<DetalleUsuario />} />
            </Route>
            <Route path="roles">
              <Route index element={<Roles />} />
              <Route path="crear"       element={<CrearRol />} />
              <Route path="editar/:id"  element={<EditarPermisos />} />
              <Route path="detalle/:id" element={<ListaRoles />} />
            </Route>
          </Route>

          {/* ========== CONFIGURACIÓN ========== */}
          <Route
            path="configuracion"
            element={<Configuracion user={user} onUserUpdate={handleUserUpdate} />}
          />

          {/* ========== 404 ========== */}
          <Route path="*" element={
            <div className="not-found-page">
              <div className="not-found-content">
                <h2>Página no encontrada</h2>
                <p>La página que buscas no existe en el sistema.</p>
                <button className="btn-primary" onClick={() => window.history.back()}>
                  Volver atrás
                </button>
              </div>
            </div>
          } />
        </Routes>
      </Box>
    </Box>
  );
}