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

// Mapeo de días para FullCalendar (0 = domingo, 1 = lunes, etc.)
const diasSemanaFC = {
  0: "domingo",
  1: "lunes",
  2: "martes",
  3: "miércoles",
  4: "jueves",
  5: "viernes",
  6: "sábado"
};

// Mapeo inverso: de día de la API (0=lunes) a día de FullCalendar (0=domingo)
const apiToFCDay = (apiDay) => {
  // API: 0=lunes, 1=martes, ..., 6=domingo
  // FC: 0=domingo, 1=lunes, ..., 6=sábado
  return apiDay === 6 ? 0 : apiDay + 1;
};

// Colores por empleado
const coloresEmpleados = [
  "#4CAF50", // Verde
  "#2196F3", // Azul
  "#FF9800", // Naranja
  "#9C27B0", // Morado
  "#F44336", // Rojo
  "#00BCD4", // Cyan
  "#FFC107", // Amarillo
  "#795548", // Marrón
];

export default function Agenda() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState("todos");
  
  // Estado para modal de error
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: ""
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar todos los datos necesarios con manejo de errores individual
      const [horariosRes, empleadosRes, citasRes, estadosRes] = await Promise.allSettled([
        getAllAgenda(),
        getEmpleados(),
        getCitas(),
        getEstadosCita()
      ]);

      // Procesar resultados
      const horariosData = horariosRes.status === 'fulfilled' ? horariosRes.value : [];
      const empleadosData = empleadosRes.status === 'fulfilled' ? empleadosRes.value : [];
      const citasData = citasRes.status === 'fulfilled' ? citasRes.value : [];
      const estadosData = estadosRes.status === 'fulfilled' ? estadosRes.value : [];

      // Verificar si hubo errores
      const errores = [];
      if (horariosRes.status === 'rejected') errores.push("horarios");
      if (empleadosRes.status === 'rejected') errores.push("empleados");
      if (citasRes.status === 'rejected') errores.push("citas");
      if (estadosRes.status === 'rejected') errores.push("estados");

      if (errores.length > 0) {
        setErrorModal({
          open: true,
          message: `No se pudieron cargar: ${errores.join(", ")}. Mostrando datos disponibles.`
        });
      }

      setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);
      setEstadosCita(Array.isArray(estadosData) ? estadosData : []);

      // Mapear eventos
      const eventosMapeados = [
        ...mapearHorarios(horariosData, empleadosData),
        ...mapearCitas(citasData, empleadosData, estadosData)
      ];

      setEvents(eventosMapeados);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("Error al cargar la agenda");
    } finally {
      setLoading(false);
    }
  };

  // Mapear horarios de disponibilidad - VERSIÓN CORREGIDA
  const mapearHorarios = (horarios, empleadosList) => {
    if (!Array.isArray(horarios)) return [];
    
    return horarios
      .filter(h => h && h.activo === true)
      .map((h) => {
        const empleado = empleadosList.find(e => e && e.id === h.empleado_id);
        const colorIndex = ((h.empleado_id - 1) % coloresEmpleados.length);
        
        // CORRECCIÓN: Convertir día de API a día de FullCalendar
        const fcDay = apiToFCDay(h.dia);
        
        return {
          id: `horario-${h.id}`,
          title: empleado ? `${empleado.nombre} (Disponible)` : "Disponible",
          daysOfWeek: [fcDay], // Ahora usa día correcto para FullCalendar
          startTime: h.hora_inicio?.substring(0,5) || "00:00",
          endTime: h.hora_final?.substring(0,5) || "00:00",
          display: "background",
          backgroundColor: coloresEmpleados[colorIndex],
          classNames: ["horario-disponible"],
          extendedProps: {
            tipo: "horario",
            empleado_id: h.empleado_id,
            empleado_nombre: empleado?.nombre || "Desconocido",
            horario_id: h.id,
            dia: h.dia,
            dia_nombre: diasSemanaFC[fcDay],
            hora_inicio: h.hora_inicio,
            hora_final: h.hora_final,
            activo: h.activo
          }
        };
      });
  };

  // Mapear citas agendadas - VERSIÓN CORREGIDA
  const mapearCitas = (citas, empleadosList, estadosList) => {
    if (!Array.isArray(citas)) return [];
    
    return citas
      .filter(c => c && c.fecha && c.hora)
      .map((c) => {
        const empleado = empleadosList.find(e => e && e.id === c.empleado_id);
        const estado = estadosList.find(e => e && e.id === c.estado_cita_id);
        
        // Determinar color según estado
        let color = "#3788d8";
        const estadoNombre = estado?.nombre?.toLowerCase() || "";
        
        if (estadoNombre.includes("cancelada")) color = "#f44336";
        else if (estadoNombre.includes("completada")) color = "#4caf50";
        else if (estadoNombre.includes("pendiente")) color = "#ff9800";
        else if (estadoNombre.includes("confirmada")) color = "#2196f3";
        
        // CORRECCIÓN: Crear fecha correctamente
        let fechaHora;
        try {
          // Asegurar formato YYYY-MM-DD
          const fechaStr = c.fecha.includes('T') ? c.fecha.split('T')[0] : c.fecha;
          fechaHora = new Date(`${fechaStr}T${c.hora}`);
        } catch (e) {
          console.error("Error creando fecha:", e);
          return null;
        }
        
        // Calcular hora final
        const duracion = c.duracion || 30;
        const horaFinal = new Date(fechaHora.getTime() + duracion * 60000);
        
        return {
          id: `cita-${c.id}`,
          title: `${c.cliente_nombre || "Cliente"} - ${c.servicio_nombre || "Servicio"}`,
          start: fechaHora,
          end: horaFinal,
          backgroundColor: color,
          borderColor: color,
          textColor: "#fff",
          classNames: ["cita-agendada"],
          extendedProps: {
            tipo: "cita",
            cita_id: c.id,
            cliente: c.cliente_nombre,
            servicio: c.servicio_nombre,
            empleado_id: c.empleado_id,
            empleado_nombre: empleado?.nombre,
            estado: estado?.nombre,
            duracion: duracion,
            metodo_pago: c.metodo_pago
          }
        };
      })
      .filter(cita => cita !== null); // Eliminar citas inválidas
  };

  // Filtrar eventos por empleado
  const eventosFiltrados = selectedEmpleado === "todos" 
    ? events 
    : events.filter(e => e.extendedProps?.empleado_id === parseInt(selectedEmpleado));

  const handleEventClick = (info) => {
    const evento = info.event;
    const props = evento.extendedProps;
    
    if (props?.tipo === "cita") {
      navigate(`/admin/servicios/citas/detalle/${props.cita_id}`);
    } else if (props?.tipo === "horario") {
      navigate("/admin/servicios/horarios");
    }
  };

  const handleDateSelect = (info) => {
    console.log("Rango seleccionado:", info.startStr, info.endStr);
    // Aquí podrías navegar a crear cita
    // navigate(`/admin/servicios/citas/crear?fecha=${info.startStr}`);
  };

  const handleCloseErrorModal = () => {
    setErrorModal({ open: false, message: "" });
  };

  if (loading) {
    return <Loading message="Cargando agenda..." />;
  }

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <h1>Agenda</h1>
        <div className="agenda-controls">
          <select 
            className="agenda-filter"
            value={selectedEmpleado}
            onChange={(e) => setSelectedEmpleado(e.target.value)}
            aria-label="Filtrar por empleado"
          >
            <option value="todos">Todos los empleados</option>
            {empleados.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre}
              </option>
            ))}
          </select>

          <button
            className="agenda-btn agenda-btn-secondary"
            onClick={() => navigate("horarios")}
          >
            📋 Ver Horarios
          </button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="agenda-legend">
        <div className="legend-item">
          <span className="legend-color disponible"></span>
          <span>Horario disponible</span>
        </div>
        <div className="legend-item">
          <span className="legend-color cita-pendiente"></span>
          <span>Pendiente</span>
        </div>
        <div className="legend-item">
          <span className="legend-color cita-confirmada"></span>
          <span>Confirmada</span>
        </div>
        <div className="legend-item">
          <span className="legend-color cita-completada"></span>
          <span>Completada</span>
        </div>
        <div className="legend-item">
          <span className="legend-color cita-cancelada"></span>
          <span>Cancelada</span>
        </div>
      </div>

      {/* Error general */}
      {error && (
        <div className="agenda-error">
          ⚠️ {error}
        </div>
      )}

      <div className="agenda-calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          locale={esLocale}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día"
          }}
          allDaySlot={false}
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          slotDuration="00:30:00"
          expandRows={true}
          height="100%"
          events={eventosFiltrados}
          eventClick={handleEventClick}
          selectable={true}
          select={handleDateSelect}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
          // Mejora: mostrar tooltip con información
          eventDidMount={(info) => {
            if (info.event.extendedProps?.tipo === 'cita') {
              info.el.title = `${info.event.title}\nCliente: ${info.event.extendedProps.cliente}\nEstado: ${info.event.extendedProps.estado}`;
            }
          }}
        />
      </div>

      {/* Modal de errores */}
      <Modal
        open={errorModal.open}
        type="warning"
        title="Error de carga"
        message={errorModal.message}
        confirmText="Aceptar"
        showCancel={false}
        onConfirm={handleCloseErrorModal}
        onCancel={handleCloseErrorModal}
      />
    </div>
  );
}