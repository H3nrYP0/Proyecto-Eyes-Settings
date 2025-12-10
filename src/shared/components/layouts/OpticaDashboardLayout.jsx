import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

// ESTOS SON LOS COMPONENTES DE LAYOUT
import Sidebar from "./Sidebar";

// ESTAS SON LAS FEATURES DE VENTAS
import Dashboard from "../../../features/dashboard/Dashboard";
import Ventas from "../../../features/ventas/pages/Ventas";
import Clientes from "../../../features/ventas/pages/Clientes";
import Pedidos from "../../../features/ventas/pages/Pedidos";
import Abonos from "../../../features/ventas/pages/Abonos";
//COMPONENTS VENTAS
import NuevaVenta from "../../../features/ventas/components/ventas/NuevaVenta";
import EditarVenta from "../../../features/ventas/components/ventas/EditarVenta";
import DetalleVenta from "../../../features/ventas/components/ventas/DetalleVenta";
//COMPONENTS CLIENTES
import CrearCliente from "../../../features/ventas/components/clientes/CrearCliente";
import EditarCliente from "../../../features/ventas/components/clientes/EditarCliente";
import DetalleCliente from "../../../features/ventas/components/clientes/DetalleCliente";
import HistorialFormula from "../../../features/ventas/components/clientes/HistorialFormula";
//COMPONENTS ABONOS
import NuevoAbono from "../../../features/ventas/components/abonos/NuevoAbono"; 
import DetalleAbono from "../../../features/ventas/components/abonos/DetalleAbono";
import EditarAbono from "../../../features/ventas/components/abonos/EditarAbono";
//COMPONENTS PEDIDOS
import CrearPedido from "../../../features/ventas/components/pedidos/CrearPedido";
import DetallePedido from "../../../features/ventas/components/pedidos/DetallePedido";
import EditarPedido from "../../../features/ventas/components/pedidos/EditarPedido";

// ESTAS SON LAS FEATURES DE COMPRAS
import Compras from "../../../features/compras/pages/Compras";
import CrearCompra from "../../../features/compras/pages/CrearCompra";
import EditarCompra from "../../../features/compras/pages/EditarCompra";
import DetalleCompra from "../../../features/compras/pages/DetalleCompra";

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

// ESTAS SON LAS FEATURES DE SERVICIOS
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

import Horarios from "../../../features/servicios/pages//horario/Horarios";

import CampanasSalud from "../../../features/servicios/pages/campanaSalud/CampanasSalud";
import CrearCampanaSalud from "../../../features/servicios/pages/campanaSalud/CrearCampanaSalud";
import EditarCampanaSalud from "../../../features/servicios/pages/campanaSalud/EditarCampanaSalud";
import DetalleCampanaSalud from "../../../features/servicios/pages/campanaSalud/DetalleCampanaSalud";

// ESTAS SON LAS FEATURES DE USUARIOS
import GestionUsuarios from "../../../features/usuarios/pages/usuario/GestionUsuarios";
import CrearUsuario from "../../../features/usuarios/pages/usuario/CrearUsuario";
import EditarUsuario from "../../../features/usuarios/pages/usuario/EditarUsuario";
import DetalleUsuario from "../../../features/usuarios/pages/usuario/DetalleUsuario";
//import GestionAcceso from "../../../features/usuarios/pages/GestionAcceso";

// ESTAS SON LAS FEATURES DE CONFIGURACIÓN
import Configuracion from "../../../features/configuracion/Configuration";

// ESTAS SON LAS FEATURES DE SEGURIDAD
import Roles from "../../../features/seguridad/pages/Roles";
import CrearRol from "../../../features/seguridad/pages/roles/CrearRol";
import Permisos from "../../../features/seguridad/pages/Permisos";

// ESTOS SON LOS ESTILOS DEL LAYOUT
import "/src/shared/styles/layouts/OpticaDashboardLayout.css";
import EditarPermisos from "../../../features/seguridad/pages/roles/EditarPermisos";
import ListaRoles from "../../../features/seguridad/pages/roles/ListaRoles";

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
            <Route path="dashboard" element={<Dashboard />} />

            {/* ESTAS SON LAS RUTAS DEL MÓDULO DE VENTAS */}
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

            {/* RUTAS DEL MÓDULO DE COMPRAS */}
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

            {/* RUTAS DEL MÓDULO DE SERVICIOS */}
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

            {/* RUTAS DEL MÓDULO DE USUARIOS */}
            <Route path="usuarios">
                <Route index element={<GestionUsuarios />} />
                <Route path="crear" element={<CrearUsuario />} />
                <Route path="editar/:id" element={<EditarUsuario />} />
                <Route path="detalle/:id" element={<DetalleUsuario />} />
              {/*<Route path="gestion-acceso" element={<GestionAcceso />} />*/}
            </Route>

            {/* RUTAS DE CONFIGURACIÓN DE LA PAGÍNA */}
            <Route path="configuracion" element={<Configuracion user={user} />} />

            {/* RUTAS DEL MÓDULO DE CONFIGURACIÓN */}
            <Route path="seguridad">
              <Route path="roles" element={<Roles />} />
              <Route path="roles/crear" element={<CrearRol />} />
              <Route path="roles/editar/:id" element={<EditarPermisos/>} />
              <Route path="roles/detalle/:id" element={<ListaRoles/>} />

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