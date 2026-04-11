import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgenda } from '../hooks/useAgenda';
import AgendaCalendar from '../components/AgendaCalendar';
import Loading from '@shared/components/ui/Loading';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
import { CircularProgress, Box } from '@mui/material';
import '../../../../shared/styles/features/agenda-calendar.css';

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

  const [notification, setNotification] = useState({ visible: false, message: '', type: 'error' });
  const [filterLoading, setFilterLoading] = useState(false);

  const showNotification = (message, type = 'error') => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 5000);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  // Mostrar errores del modal como notificación
  useEffect(() => {
    if (errorModal.open && errorModal.message) {
      showNotification(errorModal.message, 'error');
      setErrorModal({ open: false, message: '' });
    }
  }, [errorModal]);

  const handleEventClick = (info) => {
    const props = info.event.extendedProps;
    if (props?.tipo === 'cita') {
      navigate(`/admin/servicios/citas/detalle/${props.cita_id}`);
    } else {
      navigate('/admin/servicios/horarios');
    }
  };

  // Spinner al cambiar filtro
  const handleFilterChange = (e) => {
    setFilterLoading(true);
    setSelectedEmpleado(e.target.value);
    setTimeout(() => setFilterLoading(false), 300); // pequeño delay visual
  };

  if (loading) {
    return <Loading message="Cargando agenda..." />;
  }

  return (
    <div className="agenda-container">
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={handleCloseNotification}
      />

      <div className="agenda-header">
        <h1>Agenda</h1>
        <div className="agenda-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select 
              className="agenda-filter"
              value={selectedEmpleado}
              onChange={handleFilterChange}
              disabled={filterLoading}
            >
              <option value="todos">Todos los empleados</option>
              {empleados.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.nombre}</option>
              ))}
            </select>
            {filterLoading && <CircularProgress size={20} />}
          </div>
          <button
            className="agenda-btn agenda-btn-secondary"
            onClick={() => navigate('horarios')}
          >
            Ver Horarios
          </button>
        </div>
      </div>

      <div className="agenda-legend">
        <div className="legend-section">
          <div className="legend-subtitle">Horarios</div>
          <div className="legend-item">
            <span className="legend-color disponible"></span>
            <span>Disponibilidad</span>
          </div>
        </div>
        
        <div className="legend-section">
          <div className="legend-subtitle">Citas</div>
          <div className="legend-items-grid">
            <div className="legend-item"><span className="legend-color pendiente"></span>Pendiente</div>
            <div className="legend-item"><span className="legend-color confirmada"></span>Confirmada</div>
            <div className="legend-item"><span className="legend-color completada"></span>Completada</div>
            <div className="legend-item"><span className="legend-color cancelada"></span>Cancelada</div>
          </div>
        </div>
      </div>

      {error && <div className="agenda-error">⚠️ {error}</div>}

      <div className="agenda-calendar-wrapper">
        <AgendaCalendar
          events={events}
          onEventClick={handleEventClick}
          height="100%"
        />
      </div>
    </div>
  );
}