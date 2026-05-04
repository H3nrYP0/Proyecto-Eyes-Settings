import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import UsuarioForm from "../components/UserForm";
import Loading     from "@shared/components/ui/Loading";
import { getUserById, getAllRoles, normalizeUserInitialData } from "@seguridad";

export default function DetalleUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ['usuario', id] — comparte caché con EditarUsuario
  const { data: usuario, isLoading: loadingUser } = useQuery({
    queryKey: ['usuario', id],
    queryFn: async () => {
      const data = await getUserById(id);
      if (!data) throw new Error('Usuario no encontrado');
      return normalizeUserInitialData(data);
    },
    enabled: !!id,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // ['roles'] — caché global compartido
  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000,
  });

  if (loadingUser || loadingRoles) return <Loading message="Cargando..." />;

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