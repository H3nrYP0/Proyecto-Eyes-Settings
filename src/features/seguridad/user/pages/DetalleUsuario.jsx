import { useNavigate, useParams } from "react-router-dom";

import UsuarioForm from "../components/UserForm";
import Loading     from "@shared/components/ui/Loading";

import { useUsuario } from "../hooks/useUsuario"; // query cacheada, sin useState/useEffect

export default function DetalleUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Misma query key que EditarUsuario → si ya cargó antes, no vuelve a pedir al servidor
  const { user, roles, loading } = useUsuario(id);

  if (loading) return <Loading message="Cargando..." />;

  return (
    <UsuarioForm
      mode="view"
      title={`Detalle: ${user?.nombre}`}
      initialData={user}
      rolesDisponibles={roles}
      onCancel={() => navigate("/admin/seguridad/usuarios")}
      onEdit={() => navigate(`/admin/seguridad/usuarios/editar/${id}`)}
    />
  );
}