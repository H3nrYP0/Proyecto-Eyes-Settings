// ============================
// CONSTANTES DE DÍAS DE SEMANA
// ============================
export const diasSemanaMap = {
  0: "Lunes",
  1: "Martes",
  2: "Miércoles",
  3: "Jueves",
  4: "Viernes",
  5: "Sábado",
  6: "Domingo"
};

export const diasSemanaOptions = [
  { value: 0, label: "Lunes" },
  { value: 1, label: "Martes" },
  { value: 2, label: "Miércoles" },
  { value: 3, label: "Jueves" },
  { value: 4, label: "Viernes" },
  { value: 5, label: "Sábado" },
  { value: 6, label: "Domingo" },
];

// ============================
// CONVERSIÓN DE DÍAS
// ============================
// API usa 0 = lunes, FullCalendar usa 0 = domingo
export const apiToFCDay = (apiDay) => apiDay === 6 ? 0 : apiDay + 1;
export const fcToApiDay = (fcDay) => fcDay === 0 ? 6 : fcDay - 1;

// ============================
// FORMATEO DE HORAS (NUEVO CON AM/PM)
// ============================

/**
 * Convierte una hora en formato "HH:MM" o "HH:MM:SS" a AM/PM
 * Ejemplo: "14:30:00" → "02:30 PM"
 *          "08:15"   → "08:15 AM"
 */
export const formatHoraAmPm = (hora) => {
  if (!hora) return "";

  // Extraer solo HH:MM
  let horaStr = hora;
  if (horaStr.includes(':')) {
    const parts = horaStr.split(':');
    horaStr = `${parts[0]}:${parts[1]}`; // Tomar solo horas y minutos
  }

  const [hourStr, minuteStr] = horaStr.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) return horaStr;

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12; // 0 → 12 (medianoche)

  return `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Versión legacy (solo recorta segundos) - mantener por compatibilidad
 * pero en el normalizador usaremos formatHoraAmPm
 */
export const formatHora = (hora) => {
  if (!hora) return "";
  return hora.substring(0, 5);
};

// ============================
// NORMALIZACIÓN DE HORARIO (con AM/PM)
// ============================
export const normalizeHorarioForForm = (horario, empleados = []) => {
  const empleado = empleados.find(e => e.id === horario.empleado_id);
  const diaNombre = diasSemanaMap[horario.dia] || "Desconocido";

  // Obtener horas formateadas en AM/PM
  const horaInicioAmPm = formatHoraAmPm(horario.hora_inicio);
  const horaFinalAmPm = formatHoraAmPm(horario.hora_final);

  return {
    id: horario.id,
    empleado_id: horario.empleado_id,
    empleado_nombre: empleado?.nombre || "Desconocido",
    dia: horario.dia,
    dia_nombre: diaNombre,
    // Usar AM/PM para mostrar en la tabla y modales
    hora_inicio: horaInicioAmPm,
    hora_final: horaFinalAmPm,
    // Mantener los valores originales (sin formatear) para formularios
    hora_inicio_raw: horario.hora_inicio,
    hora_final_raw: horario.hora_final,
    // Campos legacy por compatibilidad
    hora_inicio_completa: horario.hora_inicio,
    hora_final_completa: horario.hora_final,
    activo: horario.activo ?? true,
    estado: horario.activo ? "activo" : "inactivo",
    estadosDisponibles: ["activo", "inactivo"],
    // Para el modal de eliminar
    descripcion: `${empleado?.nombre || "Empleado"} - ${diaNombre} ${horaInicioAmPm} a ${horaFinalAmPm}`
  };
};

export const normalizeHorariosForList = (horarios = [], empleados = []) => {
  return horarios.map(h => normalizeHorarioForForm(h, empleados));
};