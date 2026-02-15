import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RolForm from "./components/RolForm";
import { createRol, getAllPermisos } from "../../../../lib/data/rolesData";

export default function CrearRol() {

  const navigate = useNavigate();
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);

  useEffect(() => {
    const cargarPermisos = async () => {
      const data = await getAllPermisos();
      setPermisosDisponibles(data || []);
    };

    cargarPermisos();
  }, []);

  const handleCreate = async (data) => {
    await createRol(data);
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
