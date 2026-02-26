import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import UsuarioForm from "./components/UserForm";
import Loading from "../../../../shared/components/ui/Loading";

import { UserData } from "../../../../lib/data/usuariosData";
import { getAllRoles } from "../../../../lib/data/rolesData";

export default function DetalleUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [data, rolesData] = await Promise.all([
        UserData.getUserById(id),
        getAllRoles(),
      ]);

      setUsuario({
        ...data,
        email: data.correo,
        rol: data.rol_id,
      });

      setRoles(rolesData);
    } catch (error) {
      console.error(error);
      alert("Error al cargar usuario");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando usuario..." />;
  }

  if (!usuario) {
    return <div>No se encontró el usuario</div>;
  }

  return (
    <UsuarioForm
      mode="view"
      title={`Detalle del Usuario: ${usuario.nombre}`}
      initialData={usuario}
      rolesDisponibles={roles}
      onCancel={() => navigate("/admin/seguridad/usuarios")}
      onEdit={() => navigate(`/admin/seguridad/usuarios/editar/${usuario.id}`)}
    />
  );
}