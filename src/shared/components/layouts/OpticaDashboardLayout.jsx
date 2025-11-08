import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Components
import Sidebar from "./Sidebar";
import Header from "./Header";

// Features - Organizados por módulos
import Dashboard from "../../../features/ventas/pages/Dashboard";

// Módulo de Ventas
import Ventas from "../../../features/ventas/pages/Ventas";
import Clientes from "../../../features/ventas/pages/Clientes";
import Pedidos from "../../../features/ventas/pages/Pedidos";
import Abonos from "../../../features/ventas/pages/Abonos";

// Módulo de Compras
import Compras from "../../../features/compras/pages/Compras";
import Categorias from "../../../features/compras/pages/Categorias";
import Marcas from "../../../features/compras/pages/Marcas";
import Products from "../../../features/compras/pages/Products";
import Proveedores from "../../../features/compras/pages/Proveedores";
import CrearMarca from "../../../features/compras/pages/CrearMarca";

// Módulo de Servicios
import Servicios from "../../../features/servicios/pages/Servicios";
import Empleados from "../../../features/servicios/pages/Empleados";
import Agenda from "../../../features/servicios/pages/Agenda";
import Horarios from "../../../features/servicios/pages/Horarios";
import CampanasSalud from "../../../features/servicios/pages/CampanasSalud";

// Módulo de Usuarios
import GestionUsuarios from "../../../features/usuarios/pages/GestionUsuarios";
import GestionAcceso from "../../../features/usuarios/pages/GestionAcceso";

// Módulo de Configuración
import Roles from "../../../features/configuracion/pages/Roles";
import Permisos from "../../../features/configuracion/pages/Permisos";

// Styles
import "/src/shared/styles/layouts/OpticaDashboardLayout.css";

export default function OpticaDashboardLayout({ user, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Lógica de cierre de sesión
    setUser(null);
  };

  return (
    <div className="optica-dashboard-layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={handleToggleSidebar} 
        user={user} 
      />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Header 
          user={user} 
          onLogout={handleLogout}
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="content-area">
          <Routes>
            {/* Redirección por defecto */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard user={user} />} />
            
            {/* Módulo de Compras */}
            <Route path="compras">
              <Route index element={<Compras />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="marcas" element={<Marcas />} />
              <Route path="productos" element={<Products />} />
              <Route path="proveedores" element={<Proveedores />} />
              <Route path="crear-marca" element={<CrearMarca />} />
              <Route path="editar-marca/:id" element={<CrearMarca />} />
            </Route>
            
            {/* Módulo de Ventas */}
            <Route path="ventas">
              <Route index element={<Ventas />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="pedidos" element={<Pedidos />} />
              <Route path="abonos" element={<Abonos />} />
            </Route>
            
            {/* Módulo de Servicios */}
            <Route path="servicios">
              <Route index element={<Servicios />} />
              <Route path="empleados" element={<Empleados />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="horarios" element={<Horarios />} />
              <Route path="campanas-salud" element={<CampanasSalud />} />
            </Route>
            
            {/* Módulo de Usuarios */}
            <Route path="usuarios">
              <Route index element={<GestionUsuarios />} />
              <Route path="gestion-acceso" element={<GestionAcceso />} />
            </Route>
            
            {/* Módulo de Configuración */}
            <Route path="configuracion">
              <Route path="roles" element={<Roles />} />
              <Route path="permisos" element={<Permisos />} />
            </Route>
            
            {/* Página 404 */}
            <Route path="*" element={
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
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}