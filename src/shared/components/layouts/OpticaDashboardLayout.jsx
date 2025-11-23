// src/shared/components/layouts/OpticaDashboardLayout.jsx - COMPLETO
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

// ESTOS SON LOS COMPONENTES DE LAYOUT
import Sidebar from "./Sidebar";


// ESTAS SON LAS FEATURES DE VENTAS
import Dashboard from "../../../features/ventas/pages/Dashboard";
import Ventas from "../../../features/ventas/pages/Ventas";
import Clientes from "../../../features/ventas/pages/Clientes";
import Pedidos from "../../../features/ventas/pages/Pedidos";
import Abonos from "../../../features/ventas/pages/Abonos";
//COMPONENTS VENTAS
import NuevaVenta from "../../../features/ventas/components/ventas/NuevaVenta";
import EditarVenta from "../../../features/ventas/components/ventas/EditarVenta";
import DetalleVenta from "../../../features/ventas/components/ventas/DetalleVenta";
//COMPONENTS CLIENTES
import NuevoCliente from "../../../features/ventas/components/clientes/NuevoCliente";
import DetalleCliente from "../../../features/ventas/components/clientes/DetalleCliente";
import EditarCliente from "../../../features/ventas/components/clientes/EditarCliente";
import HistorialFormula from "../../../features/ventas/components/clientes/HistorialFormula";
//COMPONENTS ABONOS
import NuevoAbono from "../../../features/ventas/components/abonos/NuevoAbono"; 
import DetalleAbono from "../../../features/ventas/components/abonos/DetalleAbono";
import EditarAbono from "../../../features/ventas/components/abonos/EditarAbono";
//COMPONENTS PEDIDOS
import NuevoPedido from "../../../features/ventas/components/pedidos/NuevoPedido";
import DetallePedido from "../../../features/ventas/components/pedidos/DetallePedido";
import EditarPedido from "../../../features/ventas/components/pedidos/EditarPedido";

// ESTAS SON LAS FEATURES DE COMPRAS
import Compras from "../../../features/compras/pages/Compras";

import Categorias from "../../../features/compras/pages/categoria/Categorias";
import CrearCategoria from "../../../features/compras/pages/categoria/CrearCategoria";
import EditarCategoria from "../../../features/compras/pages/categoria/EditarCategoria";
import DetalleCategoria from "../../../features/compras/pages/categoria/DetalleCategoria";

import Marcas from "../../../features/compras/pages/Marcas";

import Products from "../../../features/compras/pages/producto/Products";
import CrearProducto from "../../../features/compras/pages/producto/CrearProducto";
import DetalleProducto from "../../../features/compras/pages/producto/DetalleProducto";
import EditarProducto from "../../../features/compras/pages/producto/EditarProducto";

import Proveedores from "../../../features/compras/pages/Proveedores";
import CrearProveedor from "../../../features/compras/pages/CrearProveedor";
import EditarProveedor from "../../../features/compras/pages/EditarProveedor";
import CrearCompra from "../../../features/compras/pages/CrearCompra";
import EditarCompra from "../../../features/compras/pages/EditarCompra";
import DetalleCompra from "../../../features/compras/pages/DetalleCompra";

// ESTAS SON LAS FEATURES DE SERVICIOS
import Servicios from "../../../features/servicios/pages/Servicios";
import Empleados from "../../../features/servicios/pages/empleado/Empleados";
import CrudEmpleados from "../../../features/servicios/pages/empleado/CrudEmpleados";
import Agenda from "../../../features/servicios/pages/agenda/Agenda";
import CrudAgenda from "../../../features/servicios/pages/agenda/CrudAgenda";


import Horarios from "../../../features/servicios/pages//horario/Horarios";
import CrudHorarios from "../../../features/servicios/pages/horario/CrudHorarios";

import CampanasSalud from "../../../features/servicios/pages/CampanasSalud";

// ESTAS SON LAS FEATURES DE USUARIOS
import GestionUsuarios from "../../../features/usuarios/pages/GestionUsuarios";
import GestionAcceso from "../../../features/usuarios/pages/GestionAcceso";

// ESTAS SON LAS FEATURES DE CONFIGURACIÓN
import Roles from "../../../features/configuracion/pages/Roles";
import Permisos from "../../../features/configuracion/pages/Permisos";

// ESTOS SON LOS ESTILOS DEL LAYOUT
import "/src/shared/styles/layouts/OpticaDashboardLayout.css";

// ESTE ES EL LAYOUT PRINCIPAL DEL DASHBOARD ADMIN
export default function OpticaDashboardLayout({ user, setUser }) {
  // ESTE ESTADO CONTROLA SI EL SIDEBAR ESTÁ ABIERTO O CERRADO
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // ESTA FUNCIÓN MANEJA EL TOGGLE DEL SIDEBAR
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // ESTA FUNCIÓN MANEJA EL CIERRE DE SESIÓN
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  // ESTA VALIDACIÓN REDIRIGE AL LOGIN SI NO HAY USUARIO
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="optica-dashboard-layout">
      
      {/* ESTE ES EL SIDEBAR DE NAVEGACIÓN */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        user={user}
        onLogout={handleLogout}
      />

      {/* ESTE ES EL CONTENIDO PRINCIPAL */}
      <div className={`main-content ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
        
        {/* ESTE ES EL HEADER SUPERIOR */}


        {/* ESTA ES EL ÁREA DONDE SE RENDERIZAN LAS PÁGINAS */}
        <main className="content-area">
          <Routes>
            
            {/* ESTA RUTA REDIRIGE AL DASHBOARD POR DEFECTO */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* ESTAS SON LAS RUTAS DEL DASHBOARD PRINCIPAL */}
            <Route path="dashboard" element={<Dashboard user={user} />} />

            {/* ESTAS SON LAS RUTAS DEL MÓDULO DE VENTAS */}
            <Route path="ventas">
              <Route index element={<Ventas />} />
              <Route path="clientes">
                <Route index element={<Clientes />} />
                <Route path="nuevo" element={<NuevoCliente />} />
                <Route path="editar" element={<EditarCliente />} />
                <Route path="detalle" element={<DetalleCliente />} />
                <Route path="historial-formula" element={<HistorialFormula />} />
              </Route>
              <Route path="abonos">
                <Route index element={<Abonos />} />
                <Route path="nuevo" element={<NuevoAbono />} />
                <Route path="editar" element={<EditarAbono />} />
                <Route path="detalle" element={<DetalleAbono />} />
              </Route>
              <Route path="pedidos">
                <Route index element={<Pedidos />} />
                <Route path="nuevo" element={<NuevoPedido />} />
                <Route path="editar" element={<EditarPedido />} />
                <Route path="detalle" element={<DetallePedido />} />
              </Route>
              <Route path="nueva" element={<NuevaVenta />} />
              <Route path="detalle/:id" element={<DetalleVenta />} />
              <Route path="editar/:id" element={<EditarVenta />} />
            </Route>

            {/* ESTAS SON LAS RUTAS DEL MÓDULO DE COMPRAS - ACTUALIZADAS */}
            <Route path="compras">
              <Route index element={<Compras />} />
              <Route path="crear" element={<CrearCompra />} />
              <Route path="editar/:id" element={<EditarCompra />} />
              <Route path="detalle/:id" element={<DetalleCompra />} />

              <Route path="categorias">
                <Route index element={<Categorias />} />
                <Route path="crear" element={<CrearCategoria />} />
                <Route path="editar/:id" element={<EditarCategoria />} />
                <Route path="detalle/:id" element={<DetalleCategoria />} />
              </Route>

              <Route path="marcas" element={<Marcas />} />
              
              <Route path="productos" element={<Products />} />
              <Route path="productos/crear" element={<CrearProducto />} />
              <Route path="productos/editar/:id" element={<EditarProducto />} />
              <Route path="productos/detalle/:id" element={<DetalleProducto />} />


              <Route path="proveedores">
                <Route index element={<Proveedores />} />
                <Route path="crear" element={<CrearProveedor />} />
                <Route path="editar/:id" element={<EditarProveedor />} />
              </Route>
            </Route>

            {/* ESTAS SON LAS RUTAS DEL MÓDULO DE SERVICIOS */}
            <Route path="servicios">
              <Route index element={<Servicios />} />
              <Route path="empleados" element={<Empleados />} />
              <Route path="empleados/crear" element={<CrudEmpleados mode="crear" />} />
              <Route path="empleados/editar/:id" element={<CrudEmpleados mode="editar" />} />
              <Route path="empleados/detalle/:id" element={<CrudEmpleados mode="detalle" />} />
              
              <Route path="agenda" element={<Agenda />} />
              <Route path="agenda/crear" element={<CrudAgenda mode="crear" />} />
              <Route path="agenda/editar/:id" element={<CrudAgenda mode="editar" />} />
              <Route path="agenda/detalle/:id" element={<CrudAgenda mode="detalle" />} />

              <Route path="horarios" element={<Horarios />} />
              <Route path="horarios/crear" element={<CrudHorarios mode="crear" />} />
              <Route path="horarios/editar/:id" element={<CrudHorarios mode="editar" />} />
              <Route path="horarios/detalle/:id" element={<CrudHorarios mode="detalle" />} />
              <Route path="campanas-salud" element={<CampanasSalud />} />
            </Route>

            {/* ESTAS SON LAS RUTAS DEL MÓDULO DE USUARIOS */}
            <Route path="usuarios">
              <Route index element={<GestionUsuarios />} />
              <Route path="gestion-acceso" element={<GestionAcceso />} />
            </Route>

            {/* ESTAS SON LAS RUTAS DEL MÓDULO DE CONFIGURACIÓN */}
            <Route path="configuracion">
              <Route path="roles" element={<Roles />} />
              <Route path="permisos" element={<Permisos />} />
            </Route>

            {/* ESTA ES LA RUTA 404 PARA PÁGINAS NO ENCONTRADAS */}
            <Route
              path="*"
              element={
                <div className="not-found-page">
                  <div className="not-found-content">
                    <h2>Página no encontrada</h2>
                    <p>La página que buscas no existe en el sistema.</p>
                    <button
                      className="btn-primary"
                      onClick={() => window.history.back()}
                    >
                      Volver atrás
                    </button>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}