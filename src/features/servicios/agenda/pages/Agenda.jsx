import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAgenda, AgendaCalendar } from '@servicios/agenda';
import Loading from '@shared/components/ui/Loading';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
import '@shared/styles/features/agenda-calendar.css';

// Colores corporativos
const BRAND_COLOR = '#1a2540';
const BRAND_HOVER = '#2d3a6b';

export default function Agenda() {
  const navigate = useNavigate();
  const {
    events,
    empleados,
    loading,
    error,
    selectedEmpleado,
    setSelectedEmpleado,
    errorModal,
    setErrorModal,
  } = useAgenda();

  // Notificaciones de errores modales
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'error' });

  const showNotification = (message, type = 'error') => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 5000);
  };

  const handleCloseNotification = () => setNotification(prev => ({ ...prev, visible: false }));

  // Escucha errores del modal y los muestra como notificación
  useEffect(() => {
    if (errorModal.open && errorModal.message) {
      showNotification(errorModal.message, 'error');
      setErrorModal({ open: false, message: '' });
    }
  }, [errorModal]);

  // Maneja clic en evento del calendario
  const handleEventClick = (info) => {
    const props = info.event.extendedProps;
    if (props?.tipo === 'cita') {
      navigate(`/admin/servicios/citas/detalle/${props.cita_id}`);
    } else {
      navigate('/admin/servicios/citas/novedades');
    }
  };

  const handleFilterChange = (e) => {
    setSelectedEmpleado(e.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Loading message="Cargando agenda..." />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      {/* Barra superior con título, filtro y botón nueva cita */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <h2 style={{ margin: 0 }}>Agenda</h2>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="empleado-select-label">Empleado</InputLabel>
            <Select
              labelId="empleado-select-label"
              value={selectedEmpleado}
              onChange={handleFilterChange}
              label="Empleado"
            >
              <MenuItem value="todos">Todos los empleados</MenuItem>
              {empleados.map(emp => (
                <MenuItem key={emp.id} value={emp.id}>{emp.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={() => navigate('/admin/servicios/citas/crear')}
            sx={{
              backgroundColor: BRAND_COLOR,
              '&:hover': { backgroundColor: BRAND_HOVER },
              textTransform: 'none'
            }}
          >
            Nueva cita
          </Button>
        </Box>
      </Box>

      {/* Notificaciones */}
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={handleCloseNotification}
      />
      {error && (
        <CrudNotification
          message={`Error al cargar datos: ${error}`}
          type="error"
          isVisible={true}
          onClose={() => {}}
        />
      )}

      {/* Calendario y leyenda */}
      <Box className="agenda-two-columns" sx={{ flex: 1, display: 'flex', gap: 2 }}>
        <Box className="agenda-calendar-wrapper" sx={{ flex: 3, minHeight: 0 }}>
          <AgendaCalendar
            events={events}
            onEventClick={handleEventClick}
            height="100%"
          />
        </Box>

        <Box component="aside" className="agenda-legend-sidebar" sx={{ flex: 1, minWidth: 200 }}>
          {/* Horarios */}
          <Box className="legend-section" sx={{ mb: 2 }}>
            <div className="legend-subtitle">Horarios</div>
            <div className="legend-item">
              <span className="legend-color disponible"></span>
              <span>Disponibilidad</span>
            </div>
          </Box>

          {/* Novedades */}
          <Box className="legend-section" sx={{ mb: 2 }}>
            <div className="legend-subtitle">Novedades</div>
            <div className="legend-item">
              <span className="legend-color novedad"></span>
              <span>Vacaciones / Incapacidades</span>
            </div>
          </Box>

          {/* Citas */}
          <Box className="legend-section" sx={{ mb: 2 }}>
            <div className="legend-subtitle">Citas</div>
            <Box className="legend-items-grid" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <div className="legend-item">
                <span className="legend-color pendiente"></span>
                <span>Pendiente</span>
              </div>
              <div className="legend-item">
                <span className="legend-color confirmada"></span>
                <span>Confirmada</span>
              </div>
              <div className="legend-item">
                <span className="legend-color completada"></span>
                <span>Completada</span>
              </div>
              <div className="legend-item">
                <span className="legend-color cancelada"></span>
                <span>Cancelada</span>
              </div>
            </Box>
          </Box>

          {/* Botones de acceso rápido */}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/admin/servicios/horarios')}
            sx={{
              borderColor: BRAND_COLOR,
              color: BRAND_COLOR,
              '&:hover': { borderColor: BRAND_HOVER, backgroundColor: 'rgba(26, 37, 64, 0.04)' },
              mb: 1,
              textTransform: 'none'
            }}
          >
            Ver Horarios
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/admin/servicios/citas/novedades')}
            sx={{
              borderColor: BRAND_COLOR,
              color: BRAND_COLOR,
              '&:hover': { borderColor: BRAND_HOVER, backgroundColor: 'rgba(26, 37, 64, 0.04)' },
              textTransform: 'none'
            }}
          >
            Ver Novedades
          </Button>
        </Box>
      </Box>
    </Box>
  );
}