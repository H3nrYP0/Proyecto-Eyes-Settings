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
import "../../../../shared/styles/features/agenda-calendar.css";

// Mapeo de días (0 = domingo, 1 = lunes, etc.)
const diasSemana = {
  0: "domingo",
  1: "lunes",
  2: "martes",
  3: "miércoles",
  4: "jueves",
  5: "viernes",
  6: "sábado"
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
  const [selectedEmpleado, setSelectedEmpleado] = useState("todos");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar todos los datos necesarios
      const [horariosData, empleadosData, citasData, estadosData] = await Promise.all([
        getAllAgenda(),
        getEmpleados(),
        getCitas(),
        getEstadosCita()
      ]);

      setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);
      setEstadosCita(Array.isArray(estadosData) ? estadosData : []);

      // Mapear eventos (horarios y citas)
      const eventosMapeados = [
        ...mapearHorarios(horariosData, empleadosData),
        ...mapearCitas(citasData, empleadosData, estadosData)
      ];

      setEvents(eventosMapeados);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mapear horarios de disponibilidad - VERSIÓN CORREGIDA
  const mapearHorarios = (horarios, empleadosList) => {
    return horarios
      .filter(h => h.activo === true) // Solo horarios activos
      .map((h) => {
        const empleado = empleadosList.find(e => e.id === h.empleado_id);
        const colorIndex = (h.empleado_id - 1) % coloresEmpleados.length;
        
        return {
          id: `horario-${h.id}`,
          title: empleado ? `${empleado.nombre} (Disponible)` : "Disponible",
          daysOfWeek: [h.dia], // La API ya envía 0=lunes, 1=martes, etc.
          startTime: h.hora_inicio.substring(0,5), // "08:00:00" → "08:00"
          endTime: h.hora_final.substring(0,5),
          display: "background",
          backgroundColor: coloresEmpleados[colorIndex],
          classNames: ["horario-disponible"],
          extendedProps: {
            tipo: "horario",
            empleado_id: h.empleado_id,
            empleado_nombre: empleado?.nombre || "Desconocido",
            horario_id: h.id,
            dia: h.dia,
            hora_inicio: h.hora_inicio,
            hora_final: h.hora_final,
            activo: h.activo
          }
        };
      });
  };

  // Mapear citas agendadas
  const mapearCitas = (citas, empleadosList, estadosList) => {
    return citas.map((c) => {
      const empleado = empleadosList.find(e => e.id === c.empleado_id);
      const estado = estadosList.find(e => e.id === c.estado_cita_id);
      
      // Determinar color según estado
      let color = "#3788d8"; // Azul por defecto
      const estadoNombre = estado?.nombre?.toLowerCase() || "";
      
      if (estadoNombre.includes("cancelada")) color = "#f44336"; // Rojo
      else if (estadoNombre.includes("completada")) color = "#4caf50"; // Verde
      else if (estadoNombre.includes("pendiente")) color = "#ff9800"; // Naranja
      else if (estadoNombre.includes("confirmada")) color = "#2196f3"; // Azul
      
      // Crear fecha combinada
      const fechaHora = new Date(`${c.fecha}T${c.hora}`);
      
      return {
        id: `cita-${c.id}`,
        title: `${c.cliente_nombre || "Cliente"} - ${c.servicio_nombre || "Servicio"}`,
        start: fechaHora,
        end: new Date(fechaHora.getTime() + (c.duracion || 30) * 60000),
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
          duracion: c.duracion,
          metodo_pago: c.metodo_pago
        }
      };
    });
  };

  // Filtrar eventos por empleado
  const eventosFiltrados = selectedEmpleado === "todos" 
    ? events 
    : events.filter(e => e.extendedProps?.empleado_id === parseInt(selectedEmpleado));

  const handleEventClick = (info) => {
    const evento = info.event;
    const props = evento.extendedProps;
    
    if (props.tipo === "cita") {
      navigate(`/admin/servicios/citas/detalle/${props.cita_id}`);
    } else if (props.tipo === "horario") {
      // Aquí podrías navegar a editar horario
      console.log("Horario clickeado:", evento.id);
    }
  };

  const handleDateSelect = (info) => {
    // Aquí podrías abrir un modal para crear cita rápida
    console.log("Rango seleccionado:", info.startStr, info.endStr);
  };

  if (loading) {
    return <Loading message="Cargando agenda..." />;
  }

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <h1>Agenda</h1>
        <div className="agenda-controls">
          {/* Filtro por empleado */}
          <select 
            className="agenda-filter"
            value={selectedEmpleado}
            onChange={(e) => setSelectedEmpleado(e.target.value)}
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
          <span>Cita pendiente</span>
        </div>
        <div className="legend-item">
          <span className="legend-color cita-confirmada"></span>
          <span>Cita confirmada</span>
        </div>
        <div className="legend-item">
          <span className="legend-color cita-completada"></span>
          <span>Cita completada</span>
        </div>
        <div className="legend-item">
          <span className="legend-color cita-cancelada"></span>
          <span>Cita cancelada</span>
        </div>
      </div>

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
        />
      </div>
    </div>
  );
}