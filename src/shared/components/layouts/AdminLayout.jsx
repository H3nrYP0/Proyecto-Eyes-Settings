import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/DashboardSidebar.css";

// 🧩 Páginas del Admin
import Dashboard from "../pages/Dashboard";

// Configuración
import Roles from "../pages/Configuracion/Roles";
import Permisos from "../pages/Configuracion/Permisos";

// Usuarios
import GestionUsuarios from "../pages/Usuarios/GestionUsuarios";
import GestionAcceso from "../pages/Usuarios/GestionAcceso";

// Compras
import Categorias from "../pages/Compras/Categorias";
import Productos from "../pages/Compras/Productos";
import Marcas from "../pages/Compras/Marcas";
import Proveedores from "../pages/Compras/Proveedores";
import Compras from "../pages/Compras/Compras";

// Páginas de creación/edición para Marcas
import CrearMarca from "../pages/Compras/CrearMarca";

// Servicios
import Servicios from "../pages/Servicios/Servicios";
import Agenda from "../pages/Servicios/Agenda";
import Horarios from "../pages/Servicios/Horarios";
import CampanasSalud from "../pages/Servicios/CampanasSalud";
import Empleados from "../pages/Servicios/Empleados";

// Ventas
import Clientes from "../pages/Ventas/Clientes";
import Pedidos from "../pages/Ventas/Pedidos";
import Abonos from "../pages/Ventas/Abonos";
import Ventas from "../pages/Ventas/Ventas";

export default function AdminLayout({ user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    alert("Sesión cerrada");
    window.location.href = "/";
  };

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
        user={user}
      />

      <div className="dashboard-main">
        <div className="admin-content">
          <Routes>
            {/* Página principal */}
            <Route path="/" element={<Dashboard />} />

            {/* ========== CONFIGURACIÓN ========== */}
            <Route path="roles" element={<Roles />} />
            <Route path="permisos" element={<Permisos />} />

            {/* ========== USUARIOS ========== */}
            <Route path="gestion-usuarios" element={<GestionUsuarios />} />
            <Route path="gestion-acceso" element={<GestionAcceso />} />

            {/* ========== COMPRAS ========== */}
            {/* Rutas específicas de Marcas PRIMERO */}
            <Route path="marcas/crear" element={<CrearMarca />} />
            <Route path="marcas/editar/:id" element={<CrearMarca />} />
            
            {/* Rutas generales DESPUÉS */}
            <Route path="categorias" element={<Categorias />} />
            <Route path="productos" element={<Productos />} />
            <Route path="marcas" element={<Marcas />} />
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="compras" element={<Compras />} />

            {/* ========== SERVICIOS ========== */}
            <Route path="servicios" element={<Servicios />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="horarios" element={<Horarios />} />
            <Route path="campanas-salud" element={<CampanasSalud />} />
            <Route path="empleados" element={<Empleados />} />

            {/* ========== VENTAS ========== */}
            <Route path="clientes" element={<Clientes />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="abonos" element={<Abonos />} />
            <Route path="ventas" element={<Ventas />} />

            {/* Ruta de fallback para páginas no encontradas */}
            <Route path="*" element={<div className="not-found">Página no encontrada</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}