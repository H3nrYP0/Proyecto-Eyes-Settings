import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import RolForm          from '@seguridad/roles/components/RolForm';
import Loading          from '@shared/components/ui/Loading';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
import { createRol, getAllPermisos } from '@seguridad/roles/services/rolServices';

export default function CrearRol() {
  const navigate = useNavigate();

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
    try {
      await createRol(data);
      sessionStorage.setItem(
        'crudNotification',
        JSON.stringify({ message: `Rol "${data.nombre}" creado correctamente`, type: 'success' })
      );
      navigate('/admin/seguridad/roles');
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Error al crear el rol';
      showNotification(msg, 'error');
    }
  };

  if (loading) return <Loading message="Cargando permisos..." />;

  return (
    <>
      <RolForm
        mode="create"
        title="Crear Rol"
        permisosDisponibles={permisosDisponibles}
        onSubmit={handleCreate}
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