import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RolForm from "./components/RolForm";

import {
  getRolById,
  updateRol
} from "../../../../lib/data/rolesData";

export default function EditarPermisos() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // ============================
  // Cargar rol
  // ============================

  useEffect(() => {
    const cargarRol = () => {
      const data = getRolById(id);

      if (!data) {
        navigate("/admin/seguridad/roles");
        return;
      }

      setRol(data);
      setLoading(false);
    };

    cargarRol();
  }, [id, navigate]);

  // ============================
  // Guardar cambios
  // ============================

  const handleUpdate = (data) => {
    updateRol(id, data);
    navigate("/admin/seguridad/roles");
  };

  if (loading) return null;

  return (
    <RolForm
      mode="edit"
      title="Editar Rol"
      initialData={rol}
      permisosDisponibles={permisosDisponibles}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/admin/seguridad/roles")}
    />
  );
}
