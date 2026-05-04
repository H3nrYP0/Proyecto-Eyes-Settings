import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import RolForm from '@seguridad/roles/components/RolForm';
import Loading from '@shared/components/ui/Loading';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
import { createRol, getAllPermisos } from '@seguridad';

export default function CrearRol() {
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    isVisible: false, message: '', type: 'success',
  });
  const showNotification = (message, type = 'success') =>
    setNotification({ isVisible: true, message, type });
  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  // Cargar permisos con React Query (caché)
  const { data: permisosDisponibles = [], isLoading: loadingPermisos } = useQuery({
    queryKey: ['permisos'],
    queryFn: getAllPermisos,
    staleTime: 5 * 60 * 1000,
  });

  // Mutación para crear rol
  const createMutation = useMutation({
    mutationFn: createRol,
    onSuccess: (_, data) => {
      sessionStorage.setItem(
        'crudNotification',
        JSON.stringify({ message: `Rol "${data.nombre}" creado correctamente`, type: 'success' })
      );
      navigate('/admin/seguridad/roles');
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || err?.message || 'Error al crear el rol';
      showNotification(msg, 'error');
    },
  });

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  if (loadingPermisos) return <Loading message="Cargando permisos..." />;

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