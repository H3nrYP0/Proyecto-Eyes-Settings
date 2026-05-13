import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CrudLayout, CrudTable, Modal, Loading } from '@shared';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';

import {
  getAllRoles,
  deleteRol,
  updateEstadoRol,
  normalizarRoles,
  normalizarRolEstado,
  filtrarRoles,
} from '@seguridad';

const ESTADO_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'activo', label: 'Activos' },
  { value: 'inactivo', label: 'Inactivos' },
];

const COLUMNS = [
  { field: 'nombre', header: 'Nombre', render: (item) => item.nombre },
  { field: 'permisos', header: 'Permisos', render: (item) => `${item.permisosCount} permisos` },
];

export default function Roles() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search,       setSearch]       = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [deleteModal,  setDeleteModal]  = useState({ open: false, id: null, nombre: '' });
  const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') =>
    setNotification({ isVisible: true, message, type });
  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  useEffect(() => {
    const pending = sessionStorage.getItem('crudNotification');
    if (pending) {
      const { message, type } = JSON.parse(pending);
      sessionStorage.removeItem('crudNotification');
      showNotification(message, type);
    }
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const rolesData = await getAllRoles();
      return normalizarRoles(rolesData);
    },
    staleTime: 1000 * 60 * 5,
    // select garantiza normalización incluso cuando los datos vienen del caché
    select: (data) => normalizarRoles(data),
  });

  const roles = data || [];

  const deleteMutation = useMutation({
    mutationFn: deleteRol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      const nombre = deleteModal.nombre;
      setDeleteModal({ open: false, id: null, nombre: '' });
      showNotification(`Rol "${nombre}" eliminado correctamente`);
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || err?.message || 'Error al eliminar el rol';
      setDeleteModal({ open: false, id: null, nombre: '' });
      showNotification(msg, 'error');
    },
  });

  const estadoMutation = useMutation({
    mutationFn: ({ id, estado }) => updateEstadoRol(id, estado),
    onSuccess: (_, { id, estado }) => {
      // Garantizar que el estado en caché siempre sea string normalizado
      const estadoNormalizado = normalizarRolEstado(estado);
      queryClient.setQueryData(['roles'], (oldRoles) => {
        if (!oldRoles) return oldRoles;
        return oldRoles.map((rol) =>
          rol.id === id ? { ...rol, estado: estadoNormalizado } : rol
        );
      });
    },
  });

  const handleDelete = (id, nombre) =>
    setDeleteModal({ open: true, id, nombre });

  const confirmDelete = () => {
    deleteMutation.mutate(deleteModal.id);
  };

  const handleChangeStatus = async (row, nuevoEstado) => {
    try {
      await estadoMutation.mutateAsync({ id: row.id, estado: nuevoEstado });
      const label = nuevoEstado === 'activo' ? 'activado' : 'desactivado';
      showNotification(`Rol "${row.nombre}" ${label} correctamente`);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Error al cambiar el estado del rol';
      showNotification(msg, 'error');
    }
  };

  const rolesVisibles = useMemo(
    () => filtrarRoles(roles, { search, estado: filterEstado }),
    [roles, search, filterEstado]
  );

  const tableActions = [
    { label: 'Ver detalles', type: 'view',   onClick: (row) => navigate(`detalle/${row.id}`) },
    { label: 'Editar',       type: 'edit',   onClick: (row) => navigate(`editar/${row.id}`) },
    { label: 'Eliminar',     type: 'delete', onClick: (row) => handleDelete(row.id, row.nombre) },
  ];

  if (isLoading && roles.length === 0) {
    return (
      <CrudLayout title="Roles" showSearch>
        <Loading message="Cargando roles..." />
      </CrudLayout>
    );
  }

  return (
    <>
      <CrudLayout
        title="Roles"
        onAddClick={() => navigate('crear')}
        showSearch
        searchPlaceholder="Buscar por nombre, descripción..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={ESTADO_OPTIONS}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
      >
        {error && (
          <div style={{ padding: '16px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '16px' }}>
            ⚠️ {error?.message || 'Error al cargar roles'}
          </div>
        )}

        <CrudTable
          columns={COLUMNS}
          data={rolesVisibles}
          actions={tableActions}
          onChangeStatus={handleChangeStatus}
          emptyMessage={
            search || filterEstado
              ? 'No se encontraron roles para los filtros aplicados'
              : 'No hay roles configurados'
          }
        />

        <Modal
          open={deleteModal.open}
          type="warning"
          title="¿Eliminar Rol?"
          message={`Esta acción eliminará el rol "${deleteModal.nombre}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ open: false, id: null, nombre: '' })}
        />
      </CrudLayout>

      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </>
  );
}