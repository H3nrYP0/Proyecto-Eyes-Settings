// features/servicios/campanaSalud/pages/CampanasSalud.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudLayout from '../../../../shared/components/crud/CrudLayout';
import CrudTable from '../../../../shared/components/crud/CrudTable';
import Modal from '../../../../shared/components/ui/Modal';
import CrudNotification from '../../../../shared/styles/components/notifications/CrudNotification';
import { useCampanasSalud } from '../hooks/useCampanasSalud';
import { ESTADO_CITA_FILTERS, ESTADO_CITA, ESTADO_CITA_LABELS, ESTADOS_BLOQUEADOS } from '../utils/constants';
import { Box, Chip, MenuItem, Select, FormControl, Tooltip, Typography } from '@mui/material';

export default function CampanasSalud() {
  const navigate = useNavigate();
  const {
    campanas,
    loading,
    notification,
    handleDelete,
    handleCambioEstado,
    hideNotification
  } = useCampanasSalud();

  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, empresa: '', bloqueada: false, razon: '' });

  // ─── Filtrado ────────────────────────────────────────────────────────────────
  const filteredCampanas = campanas.filter((campana) => {
    const matchesSearch =
      campana.empresa.toLowerCase().includes(search.toLowerCase()) ||
      (campana.contacto && campana.contacto !== '-' &&
        campana.contacto.toLowerCase().includes(search.toLowerCase()));

    let matchesFilter = true;
    if (filterEstado === 'proxima') {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const diferenciaDias = Math.ceil((campana.fechaObj - hoy) / (1000 * 60 * 60 * 24));
      matchesFilter =
        diferenciaDias <= 2 &&
        diferenciaDias >= 0 &&
        campana.estado_cita_id === ESTADO_CITA.PENDIENTE;
    } else if (filterEstado) {
      matchesFilter = campana.estado_cita_id === parseInt(filterEstado, 10);
    }

    return matchesSearch && matchesFilter;
  });

  // ─── Colores de chip ──────────────────────────────────────────────────────────
  const chipColorMap = {
    warning: 'warning',
    info: 'info',
    success: 'success',
    error: 'error',
    primary: 'primary'
  };

  // ─── Columnas responsivas ─────────────────────────────────────────────────────
  // La columna de estado usa un Select inline que actualiza directo
  const columns = [
    {
      field: 'empresa',
      header: 'Empresa',
      render: (item) => (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={500} noWrap>
            {item.empresa}
          </Typography>
          {/* En móvil se muestra el responsable dentro de la celda empresa */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: { xs: 'block', sm: 'none' } }}
            noWrap
          >
            {item.empleado_nombre}
          </Typography>
        </Box>
      )
    },
    {
      field: 'empleado_nombre',
      header: 'Responsable',
      // Ocultar en pantallas pequeñas (se ve dentro de Empresa)
      sx: { display: { xs: 'none', sm: 'table-cell' } }
    },
    {
      field: 'fechaFormateada',
      header: 'Fecha',
      render: (item) => (
        <Box>
          <Typography variant="body2">{item.fechaFormateada}</Typography>
          {/* En móvil, hora debajo de fecha */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            {item.hora}
          </Typography>
        </Box>
      )
    },
    {
      field: 'hora',
      header: 'Hora',
      sx: { display: { xs: 'none', sm: 'table-cell' } }
    },
    {
      field: 'estado',
      header: 'Estado',
      render: (item) => {
        const bloqueada = ESTADOS_BLOQUEADOS.includes(item.estado_cita_id);
        if (bloqueada) {
          return (
            <Chip
              label={item.estado_nombre}
              color={chipColorMap[item.estado_color] || 'default'}
              size="small"
            />
          );
        }
        return (
          <FormControl size="small" variant="outlined" sx={{ minWidth: 130 }}>
            <Select
              value={item.estado_cita_id}
              onChange={(e) => handleCambioEstado(item, e.target.value)}
              sx={{ fontSize: '0.8rem' }}
            >
              {/* Mostramos los estados conocidos; si hay más en BD se cargarán al abrir */}
              {Object.entries(ESTADO_CITA_LABELS).map(([id, label]) => (
                <MenuItem key={id} value={parseInt(id, 10)}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
    }
  ];

  // ─── Acciones de tabla ────────────────────────────────────────────────────────
  const tableActions = [
    {
      label: 'Ver Detalles',
      type: 'view',
      onClick: (item) => navigate(`detalle/${item.id}`)
    },
    {
      label: 'Editar',
      type: 'edit',
      onClick: (item) => {
        if (!item.esEditable) {
          const nombreEstado = ESTADO_CITA_LABELS[item.estado_cita_id] || 'este estado';
          // Forzamos notificación via handler que ya tiene showNotification
          // Para acciones que no van al hook usamos el modal de advertencia
          setDeleteModal({
            open: true,
            id: null,
            empresa: item.empresa,
            bloqueada: true,
            razon: `La campaña "${item.empresa}" está ${nombreEstado.toLowerCase()} y no puede ser editada.`,
            soloInfo: true
          });
          return;
        }
        navigate(`editar/${item.id}`);
      },
      disabled: (item) => !item.esEditable
    },
    {
      label: 'Eliminar',
      type: 'delete',
      onClick: (item) => {
        if (!item.esEliminable) {
          const nombreEstado = ESTADO_CITA_LABELS[item.estado_cita_id] || 'este estado';
          setDeleteModal({
            open: true,
            id: null,
            empresa: item.empresa,
            bloqueada: true,
            razon: `La campaña "${item.empresa}" está ${nombreEstado.toLowerCase()} y no puede ser eliminada.`,
            soloInfo: true
          });
          return;
        }
        setDeleteModal({
          open: true,
          id: item.id,
          empresa: item.empresa,
          bloqueada: false,
          razon: '',
          soloInfo: false
        });
      }
    }
  ];

  // ─── Confirmar eliminación ────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (deleteModal.id) {
      await handleDelete(deleteModal.id);
    }
    setDeleteModal({ open: false, id: null, empresa: '', bloqueada: false, razon: '', soloInfo: false });
  };

  return (
    <>
      {/* Notificación CRUD global del listado */}
      <CrudNotification
        open={notification.open}
        type={notification.type}
        message={notification.message}
        onClose={hideNotification}
      />

      <CrudLayout
        title="Campañas de Salud"
        onAddClick={() => navigate('crear')}
        showSearch={true}
        searchPlaceholder="Buscar por empresa, contacto..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={ESTADO_CITA_FILTERS}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
      >
        {/* Tabla responsiva */}
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <CrudTable
            columns={columns}
            data={filteredCampanas}
            actions={tableActions}
            loading={loading}
            emptyMessage={
              search || filterEstado
                ? 'No se encontraron campañas para los filtros aplicados'
                : 'No hay campañas registradas'
            }
          />
        </Box>
      </CrudLayout>

      {/* Modal de confirmación / advertencia */}
      <Modal
        open={deleteModal.open}
        type={deleteModal.bloqueada ? 'warning' : 'warning'}
        title={deleteModal.bloqueada ? 'Acción no permitida' : 'Eliminar Campaña'}
        message={
          deleteModal.bloqueada
            ? deleteModal.razon
            : `¿Está seguro que desea eliminar la campaña "${deleteModal.empresa}"? Esta acción no se puede deshacer.`
        }
        confirmText={deleteModal.bloqueada ? 'Entendido' : 'Eliminar'}
        cancelText="Cancelar"
        showCancel={!deleteModal.bloqueada}
        onConfirm={deleteModal.bloqueada ? () => setDeleteModal({ open: false, id: null, empresa: '', bloqueada: false, razon: '', soloInfo: false }) : confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, empresa: '', bloqueada: false, razon: '', soloInfo: false })}
      />
    </>
  );
}