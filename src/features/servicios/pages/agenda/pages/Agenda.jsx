import { useNavigate } from "react-router-dom";
import { useAgenda } from "../hooks/useAgenda";
import AgendaCalendar from "../components/AgendaCalendar";
import Modal from "../../../../../shared/components/ui/Modal";
import Loading from "../../../../../shared/components/ui/Loading";
import "../../../../../shared/styles/features/agenda-calendar.css";

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

  // ============================
  // Handlers
  // ============================
  const handleEventClick = (info) => {
    const props = info.event.extendedProps;
    if (props?.tipo === 'cita') {
      navigate(`/admin/servicios/citas/detalle/${props.cita_id}`);
    } else {
      navigate('/admin/servicios/horarios');
    }
  };

  if (loading) {
    return <Loading message="Cargando agenda..." />;
  }

  return (
    <div className="agenda-container">
      {/* Header */}
      <div className="agenda-header">
        <h1>Agenda</h1>
        <div className="agenda-controls">
          <select 
            className="agenda-filter"
            value={selectedEmpleado}
            onChange={(e) => setSelectedEmpleado(e.target.value)}
          >
            <option value="todos">Todos los empleados</option>
            {empleados.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombre}</option>
            ))}
          </select>
          <button
            className="agenda-btn agenda-btn-secondary"
            onClick={() => navigate('horarios')}
          >
            Ver Horarios
          </button>
        </div>
      </div>

      {/* Leyenda */}
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

      {/* Calendario */}
      <div className="agenda-calendar-wrapper">
        <AgendaCalendar
          events={events}
          onEventClick={handleEventClick}
          height="100%"
        />
      </div>

      <Modal
        open={errorModal.open}
        type="warning"
        title="Atención"
        message={errorModal.message}
        confirmText="Aceptar"
        showCancel={false}
        onConfirm={() => setErrorModal({ open: false, message: '' })}
      />
    </div>
  );
}