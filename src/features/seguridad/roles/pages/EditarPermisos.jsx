import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RolForm from '@security/roles/components/RolForm';
import { getRolById, updateRol, getAllPermisos } from '@security/roles/services/rolServices';

export default function EditarPermisos() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rol, setRol]                             = useState(null);
  const [permisosDisponibles, setPermisos]        = useState([]);
  const [loading, setLoading]                     = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const [rolData, permisosData] = await Promise.all([
        getRolById(id),
        getAllPermisos(),
      ]);

      if (!rolData) {
        navigate('/admin/seguridad/roles');
        return;
      }

      setRol(rolData);
      setPermisos(permisosData || []);
      setLoading(false);
    };
    cargarDatos();
  }, [id, navigate]);

  const handleUpdate = async (data) => {
    await updateRol(id, data);
    navigate('/admin/seguridad/roles');
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