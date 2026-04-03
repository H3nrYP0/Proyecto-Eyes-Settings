import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RolForm from '@seguridad/roles/components/RolForm';
import { getRolById, getAllPermisos } from '@seguridad/roles/services/rolServices';

export default function DetalleRol() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rol, setRol]                      = useState(null);
  const [permisosDisponibles, setPermisos] = useState([]);
  const [loading, setLoading]              = useState(true);

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