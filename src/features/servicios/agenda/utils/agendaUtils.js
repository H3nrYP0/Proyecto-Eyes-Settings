import { diasSemanaMap, apiToFCDay } from "../../horario/utils/horariosUtils";

// ============================
// CONSTANTES DE COLORES
// ============================
export const COLORES_ESTADO = {
  cancelada: "#ef4444",
  completada: "#10b981",
  pendiente: "#f59e0b",
  confirmada: "#3b82f6",
  default: "#6b7280"
};

// ============================
// CREAR FECHA PARA EVENTO (sin zona horaria)
// ============================
export const crearFechaEvento = (fecha, hora) => {
  try {
    // fecha viene como "YYYY-MM-DD"
    // hora puede venir como "HH:MM:SS" o "HH:MM"
    const [year, month, day] = fecha.split('-');
    let hours, minutes;
    if (hora.includes(':')) {
      const parts = hora.split(':');
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
    } else {
      return null;
    }
    // Crear fecha local (sin UTC)
    return new Date(year, month-1, day, hours, minutes);
  } catch (error) {
    console.error("Error creando fecha evento:", error);
    return null;
  }
};

// ============================
// MAPEAR HORARIOS A EVENTOS DE CALENDARIO
// ============================
export const mapearHorariosEventos = (horarios, empleados) => {
  if (!horarios?.length) return [];
  
  return horarios
    .filter(h => h.activo)
    .map(h => {
      const empleado = empleados.find(e => e.id === h.empleado_id);
      
      return {
        id: `horario-${h.id}`,
        title: `${empleado?.nombre || 'Empleado'} - Disponible`,
        daysOfWeek: [apiToFCDay(h.dia)],
        startTime: h.hora_inicio?.slice(0, 5),
        endTime: h.hora_final?.slice(0, 5),
        display: 'background',
        backgroundColor: '#93c5fd',
        classNames: ['horario-disponible'],
        extendedProps: { tipo: 'horario', empleado_id: h.empleado_id }
      };
    });
};

// ============================
// MAPEAR CITAS A EVENTOS DE CALENDARIO
// ============================
export const mapearCitasEventos = (citas, empleados, estados) => {
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

// ============================
// COLOR PARA NOVEDADES
// ============================
export const COLOR_NOVEDAD = "#fffb00"; // naranja

// ============================
// MAPEAR NOVEDADES A EVENTOS DE CALENDARIO
// ============================
export const mapearNovedadesEventos = (novedades, empleados) => {
  if (!novedades?.length) return [];

  return novedades
    .filter(n => n.activo) // solo novedades activas
    .map(n => {
      const empleado = empleados.find(e => e.id === n.empleado_id);
      const fechaInicio = n.fecha_inicio;
      const fechaFin = n.fecha_fin;
      
      // Si la novedad tiene horas específicas, se crean eventos de rango horario en fechas concretas
      if (n.hora_inicio && n.hora_fin) {
        // Rango de horas en un solo día (fechaInicio == fechaFin)
        const fechaEvento = crearFechaEvento(fechaInicio, n.hora_inicio);
        if (!fechaEvento) return null;
        const duracion = calcularMinutos(n.hora_inicio, n.hora_fin);
        return {
          id: `novedad-${n.id}`,
          title: `${n.tipo} - ${empleado?.nombre || 'Empleado'}`,
          start: fechaEvento,
          end: new Date(fechaEvento.getTime() + duracion * 60000),
          backgroundColor: COLOR_NOVEDAD,
          borderColor: COLOR_NOVEDAD,
          textColor: '#000000',
          classNames: ['novedad'],
          extendedProps: {
            tipo: 'novedad',
            novedad_id: n.id,
            empleado_id: n.empleado_id,
            empleado_nombre: empleado?.nombre,
            tipo_novedad: n.tipo,
            motivo: n.motivo,
            rango_completo: false
          }
        };
      } else {
        // Novedad de día completo (rango de fechas)
        // Para FullCalendar, se crea un evento con start y end (end excluyente, por eso sumamos 1 día)
        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);
        endDate.setDate(endDate.getDate() + 1); // FullCalendar requiere end excluyente
        return {
          id: `novedad-${n.id}`,
          title: `${n.tipo} - ${empleado?.nombre || 'Empleado'}`,
          start: startDate,
          end: endDate,
          allDay: true,
          backgroundColor: COLOR_NOVEDAD,
          borderColor: COLOR_NOVEDAD,
          textColor: '#000000',
          classNames: ['novedad'],
          extendedProps: {
            tipo: 'novedad',
            novedad_id: n.id,
            empleado_id: n.empleado_id,
            empleado_nombre: empleado?.nombre,
            tipo_novedad: n.tipo,
            motivo: n.motivo,
            rango_completo: true
          }
        };
      }
    })
    .filter(Boolean);
};

// Función auxiliar para calcular duración en minutos entre dos horas
function calcularMinutos(horaInicio, horaFin) {
  const [h1, m1] = horaInicio.split(':').map(Number);
  const [h2, m2] = horaFin.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
}