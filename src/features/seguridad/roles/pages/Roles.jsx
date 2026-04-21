import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CrudLayout, CrudTable } from '@shared';
import { Modal, Loading }        from '@shared';
import CrudNotification          from '@shared/styles/components/notifications/CrudNotification';

import { getAllRoles, deleteRol, updateEstadoRol } from '@seguridad';
import { normalizarRoles, filtrarRoles }           from '@seguridad';

const ESTADO_OPTIONS = [
  { value: '',         label: 'Todos los estados' },
  { value: 'activo',   label: 'Activos'           },
  { value: 'inactivo', label: 'Inactivos'         },
];

const COLUMNS = [
  { field: 'nombre',   header: 'Nombre',   render: (item) => item.nombre },
  { field: 'permisos', header: 'Permisos', render: (item) => `${item.permisosCount} permisos` },
];

export default function Roles() {
  const navigate = useNavigate();

  const [roles, setRoles]             = useState([]);
  const [search, setSearch]           = useState('');
  const [filterEstado, setFilter]     = useState('');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [modalDelete, setModalDelete] = useState({ open: false, id: null, nombre: '' });

  const [notification, setNotification] = useState({
    isVisible: false, message: '', type: 'success',
  });

  const showNotification = (message, type = 'success') =>
    setNotification({ isVisible: true, message, type });

  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  // Lee notificaciones pendientes dejadas por Crear / Editar
  useEffect(() => {
    const pending = sessionStorage.getItem('crudNotification');
    if (pending) {
      const { message, type } = JSON.parse(pending);
      sessionStorage.removeItem('crudNotification');
      showNotification(message, type);
    }
  }, []);

  useEffect(() => { cargarRoles(); }, []);

  const cargarRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllRoles();
      setRoles(normalizarRoles(data));
    } catch {
      setError('No se pudieron cargar los roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, nombre) =>
    setModalDelete({ open: true, id, nombre });

  const confirmDelete = async () => {
    const nombre = modalDelete.nombre;
    try {
      await deleteRol(modalDelete.id);
      setModalDelete({ open: false, id: null, nombre: '' });
      await cargarRoles();
      showNotification(`Rol "${nombre}" eliminado correctamente`);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Error al eliminar el rol';
      setModalDelete({ open: false, id: null, nombre: '' });
      showNotification(msg, 'error');
    }
  };

  const handleChangeStatus = async (row, nuevoEstado) => {
    try {
      await updateEstadoRol(row.id, nuevoEstado);
      await cargarRoles();
      const label = nuevoEstado === 'activo' ? 'activado' : 'desactivado';
      showNotification(`Rol "${row.nombre}" ${label} correctamente`);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Error al cambiar el estado del rol';
      showNotification(msg, 'error');
    }
  };

  const rolesVisibles = filtrarRoles(roles, { search, estado: filterEstado });

  const tableActions = [
    { label: 'Ver detalles', type: 'view',   onClick: (row) => navigate(`detalle/${row.id}`) },
    { label: 'Editar',       type: 'edit',   onClick: (row) => navigate(`editar/${row.id}`) },
    { label: 'Eliminar',     type: 'delete', onClick: (row) => handleDelete(row.id, row.nombre) },
  ];

  if (loading && roles.length === 0) {
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
        onFilterChange={setFilter}
      >
        {error && (
          <div style={{ padding: '16px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '16px' }}>
            ⚠️ {error}
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
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Rol?"
          message={`Esta acción eliminará el rol "${modalDelete.nombre}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={() => setModalDelete({ open: false, id: null, nombre: '' })}
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