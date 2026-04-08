import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import RolForm   from '@seguridad/roles/components/RolForm';
import Loading   from '@shared/components/ui/Loading';
import { createRol, getAllPermisos } from '@seguridad/roles/services/rolServices';

export default function CrearRol() {
  const navigate = useNavigate();

  const [permisosDisponibles, setPermisos] = useState([]);
  const [loading, setLoading]              = useState(true);

  useEffect(() => {
    const cargarPermisos = async () => {
      try {
        const data = await getAllPermisos();
        setPermisos(data || []);
      } catch (err) {
        console.error('Error al cargar permisos:', err);
      } finally {
        setLoading(false);
      }
    };
    cargarPermisos();
  }, []);

  const handleCreate = async (data) => {
    await createRol(data);
    navigate('/admin/seguridad/roles');
  };

  if (loading) return <Loading message="Cargando permisos..." />;

  return (
    <RolForm
      mode="create"
      title="Crear Rol"
      permisosDisponibles={permisosDisponibles}
      onSubmit={handleCreate}
      onCancel={() => navigate('/admin/seguridad/roles')}
    />
  );
}