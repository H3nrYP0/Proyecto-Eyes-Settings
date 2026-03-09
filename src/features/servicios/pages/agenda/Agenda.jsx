import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { 
  getAllAgenda, 
  getEmpleados,
  getCitas,
  getEstadosCita 
} from "../../../../lib/data/agendaData";
import Loading from "../../../../shared/components/ui/Loading";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/features/agenda-calendar.css";

// ============================================================================
// CONSTANTES
// ============================================================================

const COLORES_EMPLEADOS = [
  "#4CAF50", "#2196F3", "#FF9800", "#9C27B0",
  "#F44336", "#00BCD4", "#FFC107", "#795548",
];

const COLORES_ESTADO = {
  cancelada: "#ef4444",
  completada: "#10b981",
  pendiente: "#f59e0b",
  confirmada: "#3b82f6",
  default: "#6b7280"
};

// ============================================================================
// UTILIDADES
// ============================================================================

const apiToFCDay = (apiDay) => apiDay === 6 ? 0 : apiDay + 1;

const procesarResultados = (resultados) => {
  const errores = [];
  const datos = {};
  
  ['horarios', 'empleados', 'citas', 'estados'].forEach(key => {
    const res = resultados[`${key}Res`];
    datos[key] = res?.status === 'fulfilled' && Array.isArray(res.value) ? res.value : [];
    if (res?.status === 'rejected') errores.push(key);
  });

  return { ...datos, errores };
};

const crearFechaEvento = (fecha, hora) => {
  try {
    const fechaStr = fecha.includes('T') ? fecha.split('T')[0] : fecha;
    return new Date(`${fechaStr}T${hora}`);
  } catch {
    return null;
  }
};

// ============================================================================
// MAPEADORES
// ============================================================================

const mapearHorarios = (horarios, empleados) => {
  if (!horarios?.length) return [];
  
  return horarios
    .filter(h => h.activo)
    .map(h => {
      const empleado = empleados.find(e => e.id === h.empleado_id);
      
      return {
        id: `horario-${h.id}`,
        title: `${empleado?.nombre || 'Empleado'} - Disponible`,
        daysOfWeek: [apiToFCDay(h.dia)],
        startTime: h.hora_inicio?.slice(0,5),
        endTime: h.hora_final?.slice(0,5),
        display: 'background',
        backgroundColor: '#93c5fd', // Azul claro suave
        classNames: ['horario-disponible'],
        extendedProps: { tipo: 'horario', empleado_id: h.empleado_id }
      };
    });
};

const mapearCitas = (citas, empleados, estados) => {
  if (!citas?.length) return [];
  
  return citas
    .filter(c => c.fecha && c.hora)
    .map(c => {
      const empleado = empleados.find(e => e.id === c.empleado_id);
      const estado = estados.find(e => e.id === c.estado_cita_id);
      const fechaEvento = crearFechaEvento(c.fecha, c.hora);
      
      if (!fechaEvento) return null;

      const estadoLower = estado?.nombre?.toLowerCase() || '';
      let color = COLORES_ESTADO.default;
      if (estadoLower.includes('cancelada')) color = COLORES_ESTADO.cancelada;
      else if (estadoLower.includes('completada')) color = COLORES_ESTADO.completada;
      else if (estadoLower.includes('pendiente')) color = COLORES_ESTADO.pendiente;
      else if (estadoLower.includes('confirmada')) color = COLORES_ESTADO.confirmada;

      return {
        id: `cita-${c.id}`,
        title: c.cliente_nombre || 'Cliente',
        start: fechaEvento,
        end: new Date(fechaEvento.getTime() + (c.duracion || 30) * 60000),
        backgroundColor: color,
        borderColor: color,
        textColor: '#fff',
        classNames: ['cita-agendada'],
        extendedProps: {
          tipo: 'cita',
          cita_id: c.id,
          cliente: c.cliente_nombre,
          servicio: c.servicio_nombre,
          empleado: empleado?.nombre,
          estado: estado?.nombre
        }
      };
    })
    .filter(Boolean);
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function Agenda() {
  const navigate = useNavigate();
  
  // Estado
  const [events, setEvents] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState('todos');
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  // Cargar datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [horariosRes, empleadosRes, citasRes, estadosRes] = await Promise.allSettled([
          getAllAgenda(), getEmpleados(), getCitas(), getEstadosCita()
        ]);

        const { horarios, empleados, citas, estados, errores } = procesarResultados({
          horariosRes, empleadosRes, citasRes, estadosRes
        });

        if (errores.length) {
          setErrorModal({
            open: true,
            message: `No se pudieron cargar: ${errores.join(', ')}`
          });
        }

        setEmpleados(empleados);
        setEvents([...mapearHorarios(horarios, empleados), ...mapearCitas(citas, empleados, estados)]);
      } catch (err) {
        setError('Error al cargar la agenda');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Handlers
  const eventosFiltrados = selectedEmpleado === 'todos' 
    ? events 
    : events.filter(e => e.extendedProps?.empleado_id === parseInt(selectedEmpleado));

  if (loading) return <Loading message="Cargando agenda..." />;

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

      {/* Leyenda con subtítulos */}
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
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          locale={esLocale}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth'
          }}
          buttonText={{ today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día' }}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          slotDuration="00:30:00"
          expandRows={true}
          height="100%"
          events={eventosFiltrados}
          eventClick={(info) => {
            const props = info.event.extendedProps;
            if (props?.tipo === 'cita') {
              navigate(`/admin/servicios/citas/detalle/${props.cita_id}`);
            } else {
              navigate('/admin/servicios/horarios');
            }
          }}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          eventTimeFormat={{ hour: '2-digit', minute: '2-digit' }}
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