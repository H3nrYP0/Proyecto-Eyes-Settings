// src/shared/components/layouts/AdminLayout.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

// Features
import Dashboard from "../../../features/ventas/pages/Dashboard";
import Ventas from "../../../features/ventas/pages/Ventas";
import Clientes from "../../../features/ventas/pages/Clientes";
import Pedidos from "../../../features/ventas/pages/Pedidos";
import Abonos from "../../../features/ventas/pages/Abonos";
import Compras from "../../../features/compras/pages/Compras";
import Categorias from "../../../features/compras/pages/Categorias";
import Marcas from "../../../features/compras/pages/Marcas";
import Products from "../../../features/compras/pages/Products";
import Proveedores from "../../../features/compras/pages/Proveedores";
import CrearMarca from "../../../features/compras/pages/CrearMarca";
import Servicios from "../../../features/servicios/pages/Servicios";
import Empleados from "../../../features/servicios/pages/Empleados";
import Agenda from "../../../features/servicios/pages/Agenda";
import Horarios from "../../../features/servicios/pages/Horarios";
import CampanasSalud from "../../../features/servicios/pages/CampanasSalud";
import GestionUsuarios from "../../../features/usuarios/pages/GestionUsuarios";
import GestionAcceso from "../../../features/usuarios/pages/GestionAcceso";
import Roles from "../../../features/configuracion/pages/Roles";
import Permisos from "../../../features/configuracion/pages/Permisos";


export default function AdminLayout({ user, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="admin-layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
        user={user} 
      />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Header 
          user={user} 
          setUser={setUser} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <div className="content-area">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard user={user} />} />
            
            {/* Compras */}
            <Route path="compras" element={<Compras />} />
            <Route path="compras/categorias" element={<Categorias />} />
            <Route path="compras/marcas" element={<Marcas />} />
            <Route path="compras/productos" element={<Products />} />
            <Route path="compras/proveedores" element={<Proveedores />} />
            <Route path="compras/crear-marca" element={<CrearMarca />} />
            <Route path="compras/editar-marca/:id" element={<CrearMarca />} />
            
            {/* Ventas */}
            <Route path="ventas" element={<Ventas />} />
            <Route path="ventas/clientes" element={<Clientes />} />
            <Route path="ventas/pedidos" element={<Pedidos />} />
            <Route path="ventas/abonos" element={<Abonos />} />
            
            {/* Servicios */}
            <Route path="servicios" element={<Servicios />} />
            <Route path="servicios/empleados" element={<Empleados />} />
            <Route path="servicios/agenda" element={<Agenda />} />
            <Route path="servicios/horarios" element={<Horarios />} />
            <Route path="servicios/campanas-salud" element={<CampanasSalud />} />
            
            {/* Usuarios */}
            <Route path="usuarios" element={<GestionUsuarios />} />
            <Route path="usuarios/gestion-acceso" element={<GestionAcceso />} />
            
            {/* Configuración */}
            <Route path="configuracion/roles" element={<Roles />} />
            <Route path="configuracion/permisos" element={<Permisos />} />
            
            <Route path="*" element={<div className="not-found">
              <h2>Página no encontrada</h2>
              <p>La página que buscas no existe.</p>
            </div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}