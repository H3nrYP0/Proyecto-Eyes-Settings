import { useNavigate, useParams } from 'react-router-dom';

import RolForm         from '@seguridad/roles/components/RolForm';
import { useRol }      from '@seguridad/roles/hooks/useRol';
import { updateRol }   from '@seguridad/roles/services/rolServices';

export default function EditarPermisos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rol, permisosDisponibles, loading } = useRol(id);

  const handleUpdate = async (data) => {
    try {
      await updateRol(id, data);
      navigate('/admin/seguridad/roles');
    } catch {
      alert('Error al actualizar el rol');
    }
  };

  if (loading) return null;

  return (
    <RolForm
      mode="edit"
      title="Editar Rol"
      initialData={rol}
      permisosDisponibles={permisosDisponibles}
      onSubmit={handleUpdate}
      onCancel={() => navigate('/admin/seguridad/roles')}
    />
  );
}