import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RolForm          from '@seguridad/roles/components/RolForm';
import Loading          from '@shared/components/ui/Loading';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
import { getRolById, updateRol, getAllPermisos } from '@seguridad/roles/services/rolServices';
import { normalizarRolInitialData } from '@seguridad/roles/utils/rolNormalizer';

export default function EditarPermisos() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [rol, setRol]                      = useState(null);
  const [permisosDisponibles, setPermisos] = useState([]);
  const [loading, setLoading]              = useState(true);

  const [notification, setNotification] = useState({
    isVisible: false, message: '', type: 'success',
  });
  const showNotification = (message, type = 'success') =>
    setNotification({ isVisible: true, message, type });
  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [rolData, permisosData] = await Promise.all([
          getRolById(id),
          getAllPermisos(),
        ]);

        if (!rolData) {
          navigate('/admin/seguridad/roles');
          return;
        }

        setRol(normalizarRolInitialData(rolData));
        setPermisos(permisosData || []);
      } catch (err) {
        console.error('Error al cargar rol:', err);
        navigate('/admin/seguridad/roles');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id, navigate]);

  const handleUpdate = async (data) => {
    try {
      await updateRol(id, data);
      sessionStorage.setItem(
        'crudNotification',
        JSON.stringify({ message: `Rol "${data.nombre}" actualizado correctamente`, type: 'success' })
      );
      navigate('/admin/seguridad/roles');
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Error al actualizar el rol';
      showNotification(msg, 'error');
    }
  };

  if (loading) return <Loading message="Cargando rol..." />;

  return (
    <>
      <RolForm
        mode="edit"
        title="Editar Rol"
        initialData={rol}
        permisosDisponibles={permisosDisponibles}
        onSubmit={handleUpdate}
        onCancel={() => navigate('/admin/seguridad/roles')}
      />

      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </>
  );
}