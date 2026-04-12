import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgenda } from '../hooks/useAgenda';
import AgendaCalendar from '../components/AgendaCalendar';
import Loading from '@shared/components/ui/Loading';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
import CrudLayout from '@shared/components/crud/CrudLayout';
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
      navigate('/admin/servicios/horarios');
    }
  };

  // Filtros para CrudLayout
  const empleadoFilters = [
    { value: 'todos', label: 'Todos los empleados' },
    ...empleados.map(emp => ({ value: emp.id.toString(), label: emp.nombre }))
  ];

  const handleFilterChange = (value) => {
    setSelectedEmpleado(value);
  };

  if (loading) {
    return (
      <CrudLayout title="Agenda" onAddClick={() => navigate('/admin/servicios/citas/crear')}>
        <Loading message="Cargando agenda..." />
      </CrudLayout>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CrudLayout
        title="Agenda"
        onAddClick={() => navigate('/admin/servicios/citas/crear')}
        showSearch={false}
        searchFilters={empleadoFilters}
        filterEstado={selectedEmpleado}
        onFilterChange={handleFilterChange}
      >
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
            <button className="agenda-btn" style={{ marginTop: '8px' }} onClick={() => navigate('/admin/servicios/citas/novedades')}>
              Ver Novedades
            </button>
          </aside>
        </div>
      </CrudLayout>
    </div>
  );
}