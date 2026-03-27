import { useNavigate, useParams } from 'react-router-dom';

import RolForm    from '@seguridad/roles/components/RolForm';
import { useRol } from '@seguridad/roles/hooks/useRol';

export default function DetalleRol() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rol, permisosDisponibles, loading } = useRol(id);

  if (loading) return null;

  return (
    <RolForm
      mode="view"
      title="Detalle del Rol"
      initialData={rol}
      permisosDisponibles={permisosDisponibles}
      onCancel={() => navigate('/admin/seguridad/roles')}
      onEdit={() => navigate(`/admin/seguridad/roles/editar/${rol.id}`)}
    />
  );
}