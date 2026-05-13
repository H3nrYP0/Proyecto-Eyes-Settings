import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getAllRoles } from "@seguridad/roles/services/rolServices";
import { getUserById } from "../services/userServices";
import { normalizeUserInitialData } from "../utils/userNormalizer";
import UserForm from "../components/UserForm";
import Loading  from "@shared/components/ui/Loading";

export default function DetalleUsuario() {
  const { id }   = useParams();
  const navigate = useNavigate();

  // Comparte caché ['usuario', id] con EditarUsuario
  const { data: usuario, isLoading: loadingUser } = useQuery({
    queryKey: ["usuario", id],
    queryFn: async () => {
      const data = await getUserById(id);
      if (!data) throw new Error("Usuario no encontrado");
      return normalizeUserInitialData(data);
    },
    enabled:   !!id,
    retry:     false,
    staleTime: 5 * 60 * 1000,
  });

  // Comparte caché ['roles'] global
  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn:  getAllRoles,
    staleTime: 5 * 60 * 1000,
  });

  if (loadingUser || loadingRoles) return <Loading message="Cargando..." />;

  return (
    <UserForm
      mode="view"
      title={`Detalle: ${usuario?.nombre}`}
      initialData={usuario}
      rolesDisponibles={roles}
      onCancel={() => navigate("/admin/seguridad/usuarios")}
      onEdit={() => navigate(`/admin/seguridad/usuarios/editar/${id}`)}
    />
  );
}