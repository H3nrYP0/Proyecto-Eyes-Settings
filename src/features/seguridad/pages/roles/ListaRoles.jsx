import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getRolById,
  getAllPermisos
} from "../../../../lib/data/rolesData";

import RolForm from "./components/RolForm";

export default function DetalleRol() {

  const navigate = useNavigate();
  const { id } = useParams();

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

  if (loading) return <div>Cargando...</div>;

  return (
    <RolForm
      mode="view"
      title="Detalle del Rol"
      initialData={rol}
      permisosDisponibles={permisosDisponibles}
      onCancel={() => navigate("/admin/seguridad/roles")}
      onEdit={() =>
        navigate(`/admin/seguridad/roles/editar/${rol.id}`)
      }
    />
  );
}
