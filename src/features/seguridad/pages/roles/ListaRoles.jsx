import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRolById } from "../../../../lib/data/rolesData";
import { permisosDisponibles } from "../../../../shared/constants/permisos";

import RolForm from "./components/RolForm";

export default function DetalleRol() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [rol, setRol] = useState(null);

  useEffect(() => {
    const data = getRolById(id);
    setRol(data);
  }, [id]);

  if (!rol) {
    return <div>Cargando...</div>;
  }

  return (
    <RolForm
      mode="view"
      title={`Detalle del Rol`}
      initialData={rol}
      permisosDisponibles={permisosDisponibles}
      onCancel={() => navigate("/admin/seguridad/roles")}
      onEdit={() =>
        navigate(`/admin/seguridad/roles/editar/${rol.id}`)
      }
    />
  );
}
