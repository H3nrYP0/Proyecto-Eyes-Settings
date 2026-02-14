import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RolForm from "./components/RolForm";

import {
  getRolById,
  updateRol,
  getAllPermisos
} from "../../../../lib/data/rolesData";

export default function EditarPermisos() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [rol, setRol] = useState(null);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const rolData = await getRolById(id);
      const permisosData = await getAllPermisos();

      if (!rolData) {
        navigate("/admin/seguridad/roles");
        return;
      }

      setRol(rolData);
      setPermisosDisponibles(permisosData || []);
      setLoading(false);
    };

    cargarDatos();
  }, [id, navigate]);

  const handleUpdate = async (data) => {
    await updateRol(id, data);
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
