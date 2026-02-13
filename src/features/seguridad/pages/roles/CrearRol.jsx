import { useNavigate } from "react-router-dom";
import RolForm from "./components/RolForm";
import { createRol } from "../../../../lib/data/rolesData";

export default function CrearRol() {

  const navigate = useNavigate();

  const permisosDisponibles = [
    { id: "dashboard", nombre: "Gestionar Dashboard" },
    { id: "categorias", nombre: "Gestionar Categorías" },
    { id: "compras", nombre: "Gestionar Compras" },
    { id: "empleados", nombre: "Gestionar Empleados" },
    { id: "ventas", nombre: "Gestionar Ventas" },
    { id: "roles", nombre: "Gestionar Roles" },
    { id: "productos", nombre: "Gestionar Productos" },
    { id: "servicios", nombre: "Gestionar Servicios" },
    { id: "clientes", nombre: "Gestionar Clientes" },
    { id: "campanas_salud", nombre: "Gestionar Campañas de Salud" },
    { id: "usuarios", nombre: "Gestionar Usuarios" },
    { id: "proveedores", nombre: "Gestionar Proveedores" },
    { id: "agenda", nombre: "Gestionar Agenda" },
    { id: "pedidos", nombre: "Gestionar Pedidos" }
  ];

  const handleCreate = (data) => {
    createRol(data);
    navigate("/admin/seguridad/roles");
  };

  return (
    <RolForm
      mode="create"
      title="Crear Nuevo Rol"
      permisosDisponibles={permisosDisponibles}
      onSubmit={handleCreate}
      onCancel={() => navigate("/admin/seguridad/roles")}
    />
  );
}
