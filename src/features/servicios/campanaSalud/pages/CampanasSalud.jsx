// features/servicios/campanaSalud/pages/CampanasSalud.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudLayout from '../../../../shared/components/crud/CrudLayout';
import CrudTable from '../../../../shared/components/crud/CrudTable';
import Modal from '../../../../shared/components/ui/Modal';
import CrudNotification from '../../../../shared/styles/components/notifications/CrudNotification';
import { useCampanasSalud } from '../hooks/useCampanasSalud';
import { ESTADO_CITA_FILTERS, ESTADO_CITA } from '../utils/constants';

export default function CampanasSalud() {
  const navigate = useNavigate();
  const {
    campanas,
    loading,
    notification,
    handleDelete,
    handleCambioEstado,
    hideNotification,
    showNotification,
  } = useCampanasSalud();

  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    empresa: '',
  });

  const filteredCampanas = campanas.filter((campana) => {
    const matchesSearch =
      campana.empresa.toLowerCase().includes(search.toLowerCase()) ||
      (campana.contacto &&
        campana.contacto !== '-' &&
        campana.contacto.toLowerCase().includes(search.toLowerCase()));

    let matchesFilter = true;
    if (filterEstado === 'proxima') {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const diferenciaDias = Math.ceil(
        (campana.fechaObj - hoy) / (1000 * 60 * 60 * 24)
      );
      matchesFilter =
        diferenciaDias <= 2 &&
        diferenciaDias >= 0 &&
        campana.estado_cita_id === ESTADO_CITA.PENDIENTE;
    } else if (filterEstado) {
      matchesFilter = campana.estado_cita_id === parseInt(filterEstado, 10);
    }
    return matchesSearch && matchesFilter;
  });

  const columns = [
    { field: 'empresa', header: 'Empresa' },
    { field: 'empleado_nombre', header: 'Responsable' },
    { field: 'fechaFormateada', header: 'Fecha' },
    { field: 'hora', header: 'Hora' },
  ];

  const tableActions = [
    {
      label: 'Ver Detalles',
      type: 'view',
      onClick: (item) => navigate(`detalle/${item.id}`),
    },
    {
      label: 'Editar',
      type: 'edit',
      onClick: (item) => {
        if (!item.esEditable) {
          showNotification(
            'warning',
            `La campaña "${item.empresa}" está ${item.estado.toLowerCase()} y no puede ser editada.`
          );
          return;
        }
        navigate(`editar/${item.id}`);
      },
      disabled: (item) => !item.esEditable,
    },
    {
      label: 'Eliminar',
      type: 'delete',
      onClick: (item) => {
        if (!item.esEliminable) {
          showNotification(
            'warning',
            `La campaña "${item.empresa}" está ${item.estado.toLowerCase()} y no puede ser eliminada.`
          );
          return;
        }
        setDeleteModal({ open: true, id: item.id, empresa: item.empresa });
      },
    },
  ];

  const confirmDelete = async () => {
    if (deleteModal.id) {
      await handleDelete(deleteModal.id);
    }
    setDeleteModal({ open: false, id: null, empresa: '' });
  };

  return (
    <>
      <CrudNotification
        isVisible={notification.open}
        type={notification.type}
        message={notification.message}
        onClose={hideNotification}
      />

      <CrudLayout
        title="Campañas de Salud"
        onAddClick={() => navigate('crear')}
        showSearch
        searchPlaceholder="Buscar por empresa, contacto..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={ESTADO_CITA_FILTERS}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
      >
        <CrudTable
          columns={columns}
          data={filteredCampanas}
          actions={tableActions}
          loading={loading}
          onChangeStatus={handleCambioEstado}
          emptyMessage={
            search || filterEstado
              ? 'No se encontraron campañas para los filtros aplicados'
              : 'No hay campañas registradas'
          }
        />
      </CrudLayout>

      <Modal
        open={deleteModal.open}
        type="warning"
        title="Eliminar Campaña"
        message={`¿Está seguro que desea eliminar la campaña "${deleteModal.empresa}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, empresa: '' })}
      />
    </>
  );
}