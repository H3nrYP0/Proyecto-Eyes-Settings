import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import UsuarioForm from "../components/UserForm";
import Loading     from "@shared/components/ui/Loading";

// Servicios desde el barril
import { getUserById, getAllRoles } from "@seguridad";

export default function DetalleUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [data, rolesData] = await Promise.all([
        getUserById(id),
        getAllRoles(),
      ]);
      setUsuario({ ...data, email: data.correo, rol: data.rol_id });
      setRoles(rolesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Cargando..." />;

  return (
    <UsuarioForm
      mode="view"
      title={`Detalle: ${usuario?.nombre}`}
      initialData={usuario}
      rolesDisponibles={roles}
      onCancel={() => navigate("/admin/seguridad/usuarios")}
      onEdit={() => navigate(`/admin/seguridad/usuarios/editar/${id}`)}
    />
  );
}