import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CrudLayout from '@shared/components/crud/CrudLayout';
import CrudTable  from '@shared/components/crud/CrudTable';
import Modal      from '@shared/components/ui/Modal';
import Loading    from '@shared/components/ui/Loading';

import { getAllRoles, deleteRol, updateEstadoRol, normalizarRoles, filtrarRoles } from '@seguridad';

// Opciones para el filtro de estado
const ESTADO_OPTIONS = [
  { value: '',         label: 'Todos los estados' },
  { value: 'activo',   label: 'Activos' },
  { value: 'inactivo', label: 'Inactivos' },
];

// Columnas de la tabla
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
    setModalDelete({ open: false, id, nombre });

  const confirmDelete = async () => {
    try {
      await deleteRol(modalDelete.id);
      await cargarRoles();
      setModalDelete({ open: false, id: null, nombre: '' });
    } catch {
      alert('Error al eliminar el rol');
    }
  };

  const handleChangeStatus = async (row, nuevoEstado) => {
    try {
      await updateEstadoRol(row.id, nuevoEstado);
      await cargarRoles();
    } catch {
      alert('Error al cambiar el estado del rol');
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
  );
}