// src/shared/components/layouts/OpticaDashboardLayout.jsx - COMPLETO
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

// ESTOS SON LOS COMPONENTES DE LAYOUT
import Sidebar from "./Sidebar";
import Header from "./Header";

// ESTAS SON LAS FEATURES DE VENTAS
import Dashboard from "../../../features/ventas/pages/Dashboard";
import Ventas from "../../../features/ventas/pages/Ventas";
import Clientes from "../../../features/ventas/pages/Clientes";
import Pedidos from "../../../features/ventas/pages/Pedidos";
import Abonos from "../../../features/ventas/pages/Abonos";

// ESTAS SON LAS FEATURES DE COMPRAS
import Compras from "../../../features/compras/pages/Compras";
import Categorias from "../../../features/compras/pages/Categorias";
import Marcas from "../../../features/compras/pages/Marcas/Marcas"
import EditarMarca from "../../../features/compras/pages/Marcas/EditarMarca"
import DEtalleMarca from "../../../features/compras/pages/Marcas/DEtalleMarca"
import NuevaMarca from "../../../features/compras/pages/Marcas/NuevaMarca"

import Products from "../../../features/compras/pages/productos/Products";
import AgregarProducto from "../../../features/compras/pages/productos/AgregarProducto";
import DetalleProducto from "../../../features/compras/pages/productos/DetalleProducto";
import EditarProducto from "../../../features/compras/pages/productos/EditarProducto";

import Proveedores from "../../../features/compras/pages/Proveedores";
import CrearProveedor from "../../../features/compras/pages/CrearProveedor";
import EditarProveedor from "../../../features/compras/pages/EditarProveedor";
import CrearCompra from "../../../features/compras/pages/CrearCompra";
import EditarCompra from "../../../features/compras/pages/EditarCompra";
import DetalleCompra from "../../../features/compras/pages/DetalleCompra";

// ESTAS SON LAS FEATURES DE SERVICIOS
import Servicios from "../../../features/servicios/pages/servicios/Servicios";
import AgregarServicio from "../../../features/servicios/pages/servicios/AgregarServicio";
import DetalleServicio from "../../../features/servicios/pages/servicios/DetalleServicio";
import EditarServicio from "../../../features/servicios/pages/servicios/EditarServicio";

import Empleados from "../../../features/servicios/pages/Empleados";
import Agenda from "../../../features/servicios/pages/Agenda";
import Horarios from "../../../features/servicios/pages/Horarios";
import CampanasSalud from "../../../features/servicios/pages/campanasSalud/CampanasSalud";
import AgregarCampana from "../../../features/servicios/pages/campanasSalud/AgregarCampana";
import DetalleCampana from "../../../features/servicios/pages/campanasSalud/DetalleCampana";
import EditarCampana from "../../../features/servicios/pages/campanasSalud/EditarCampana";

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
        <Header
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={sidebarOpen}
        />

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
              <Route path="clientes" element={<Clientes />} />
              <Route path="pedidos" element={<Pedidos />} />
              <Route path="abonos" element={<Abonos />} />
            </Route>

            {/* ESTAS SON LAS RUTAS DEL MÓDULO DE COMPRAS - ACTUALIZADAS */}
            <Route path="compras">
              <Route index element={<Compras />} />
              <Route path="crear" element={<CrearCompra />} />
              <Route path="editar/:id" element={<EditarCompra />} />
              <Route path="detalle/:id" element={<DetalleCompra />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="marcas" element={<Marcas />} />
              <Route path="marcas/nueva" element={<NuevaMarca />} />
              <Route path="marcas/editar" element={<EditarMarca />} />
              <Route path="marcas/detalle" element={<DEtalleMarca />} />
              <Route path="productos" element={<Products />} />
              <Route path="productos/agregar" element={<AgregarProducto />} />
              <Route path="productos/detalle" element={<DetalleProducto />} />
              <Route path="productos/editar" element={<EditarProducto />} />
              <Route path="proveedores">
                <Route index element={<Proveedores />} />
                <Route path="crear" element={<CrearProveedor />} />
                <Route path="editar/:id" element={<EditarProveedor />} />
              </Route>
            </Route>

            {/* ESTAS SON LAS RUTAS DEL MÓDULO DE SERVICIOS */}
            <Route path="servicios">
              <Route index element={<Servicios />} />
              <Route path="agregar" element={<AgregarServicio/>}/>
              <Route path="detalle" element={<DetalleServicio/>}/>
              <Route path="editar" element={<EditarServicio/>}/>
              <Route path="empleados" element={<Empleados />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="horarios" element={<Horarios />} />
              <Route path="campanas-salud" element={<CampanasSalud />} />
              <Route path="campanas-salud/nuevo" element={<AgregarCampana />} />
              <Route path="campanas-salud/editar" element={<EditarCampana />} />
              <Route path="campanas-salud/detalle" element={<DetalleCampana />} />
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