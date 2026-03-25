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
// CREAR FECHA PARA EVENTO
// ============================
export const crearFechaEvento = (fecha, hora) => {
  try {
    const fechaStr = fecha.includes('T') ? fecha.split('T')[0] : fecha;
    return new Date(`${fechaStr}T${hora}`);
  } catch {
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