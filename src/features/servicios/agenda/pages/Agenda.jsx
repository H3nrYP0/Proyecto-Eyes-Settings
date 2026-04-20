import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgenda } from '../hooks/useAgenda';
import AgendaCalendar from '../components/AgendaCalendar';
import Loading from '@shared/components/ui/Loading';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
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

  const showNotification = (message, type = 'error') => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 5000);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

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
      navigate('/admin/servicios/citas/novedades');
    }
  };

  const handleFilterChange = (e) => {
    setSelectedEmpleado(e.target.value);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <Loading message="Cargando agenda..." />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
      {/* Barra superior con título y selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Agenda</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label htmlFor="empleado-select" style={{ fontWeight: 'bold' }}>Empleado:</label>
          <select
            id="empleado-select"
            value={selectedEmpleado}
            onChange={handleFilterChange}
            style={{ padding: '0.3rem 0.6rem', borderRadius: '0.375rem', border: '1px solid #ccc' }}
          >
            <option value="todos">Todos los empleados</option>
            {empleados.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombre}</option>
            ))}
          </select>
          <button
            className="agenda-btn"
            onClick={() => navigate('/admin/servicios/citas/crear')}
            style={{ background: '#0d2e2e', color: 'white', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '0.375rem', cursor: 'pointer' }}
          >
            + Nueva cita
          </button>
        </div>
      </div>

      {/* Notificaciones */}
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={handleCloseNotification}
      />
      {error && (
        <CrudNotification
          message={`⚠️ Error al cargar datos: ${error}`}
          type="error"
          isVisible={true}
          onClose={() => {}}
        />
      )}

      {/* Calendario y leyenda */}
      <div className="agenda-two-columns">
        <div className="agenda-calendar-wrapper">
          <AgendaCalendar
            events={events}
            onEventClick={handleEventClick}
            height="100%"
          />
        </div>

        <aside className="agenda-legend-sidebar">
          <div className="legend-section">
            <div className="legend-subtitle">Horarios</div>
            <div className="legend-item">
              <span className="legend-color disponible"></span>
              <span>Disponibilidad</span>
            </div>
          </div>

          <div className="legend-section">
            <div className="legend-subtitle">Novedades</div>
            <div className="legend-item">
              <span className="legend-color novedad"></span>
              <span>Vacaciones / Incapacidades</span>
            </div>
          </div>

          <div className="legend-section">
            <div className="legend-subtitle">Citas</div>
            <div className="legend-items-grid">
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
            </div>
          </div>

          <button
            className="agenda-btn"
            onClick={() => navigate('/admin/servicios/horarios')}
          >
            Ver Horarios
          </button>
          <button
            className="agenda-btn"
            style={{ marginTop: '8px' }}
            onClick={() => navigate('/admin/servicios/citas/novedades')}
          >
            Ver Novedades
          </button>
        </aside>
      </div>
    </div>
  );
}