export const tiposNovedad = [
  { value: "vacaciones", label: "Vacaciones" },
  { value: "incapacidad", label: "Incapacidad" },
  { value: "permiso", label: "Permiso" },
  { value: "licencia", label: "Licencia" },
  { value: "otro", label: "Otro" },
];

// ============================
// FORMATEO DE HORAS (AM/PM)
// ============================

/**
 * Convierte una hora en formato "HH:MM" o "HH:MM:SS" a AM/PM
 * Ejemplo: "14:30:00" → "02:30 PM"
 *          "08:15"   → "08:15 AM"
 */
export const formatHoraAmPm = (hora) => {
  if (!hora) return "";

  let horaStr = hora;
  if (horaStr.includes(':')) {
    const parts = horaStr.split(':');
    horaStr = `${parts[0]}:${parts[1]}`; // Tomar solo HH:MM
  }

  const [hourStr, minuteStr] = horaStr.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) return horaStr;

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12; // 0 → 12 (medianoche)

  return `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

// ============================
// FORMATEO DE FECHAS
// ============================

export const formatFecha = (fecha) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES");
};

// ============================
// NORMALIZACIÓN DE NOVEDADES (con AM/PM)
// ============================

export const normalizeNovedadForList = (novedad, empleados = []) => {
  const empleado = empleados.find(e => e.id === novedad.empleado_id);
  const fechaInicio = formatFecha(novedad.fecha_inicio);
  const fechaFin = formatFecha(novedad.fecha_fin);
  const fechas_display = fechaInicio === fechaFin ? fechaInicio : `${fechaInicio} - ${fechaFin}`;

  // 🔥 Usar AM/PM para las horas
  const horaInicioDisplay = formatHoraAmPm(novedad.hora_inicio);
  const horaFinDisplay = formatHoraAmPm(novedad.hora_fin);
  const rangoHoras = novedad.hora_inicio && novedad.hora_fin
    ? `${horaInicioDisplay} - ${horaFinDisplay}`
    : "Todo el día";

  const descripcion = `${empleado?.nombre || "Empleado"} - ${novedad.tipo}: ${fechas_display} (${rangoHoras})`;

  return {
    id: novedad.id,
    empleado_id: novedad.empleado_id,
    empleado_nombre: empleado?.nombre || "Desconocido",
    // Campos originales (formato 24h) para edición/vista
    fecha_inicio: novedad.fecha_inicio,
    fecha_fin: novedad.fecha_fin,
    hora_inicio: novedad.hora_inicio,      // valor original (24h)
    hora_fin: novedad.hora_fin,            // valor original (24h)
    tipo: novedad.tipo,
    motivo: novedad.motivo,
    activo: novedad.activo,
    // Campos para mostrar en tabla y detalles (con AM/PM)
    fechas_display,
    rango_horas: rangoHoras,              // Ya en AM/PM
    tipo_label: tiposNovedad.find(t => t.value === novedad.tipo)?.label || novedad.tipo,
    estado: novedad.activo ? "activo" : "inactivo",
    estadosDisponibles: ["activo", "inactivo"],
    descripcion,
  };
};

export const normalizeNovedadesForList = (novedades = [], empleados = []) => {
  return novedades.map(n => normalizeNovedadForList(n, empleados));
};