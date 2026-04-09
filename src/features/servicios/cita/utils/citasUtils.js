// ============================
// Formatear fecha para mostrar
// ============================
export const formatFecha = (fecha) => {
  if (!fecha) return "N/A";
  
  // Si la fecha viene como string "YYYY-MM-DD" (formato del backend)
  if (typeof fecha === 'string' && fecha.includes('-')) {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }
  
  // Si viene como objeto Date o timestamp, usar método seguro
  try {
    const date = new Date(fecha);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("es-ES");
    }
  } catch (e) {
    console.error("Error formateando fecha:", e);
  }
  
  return fecha;
};

// ============================
// Formatear hora para mostrar (Formato 12 horas con AM/PM)
// ============================
export const formatHora = (hora) => {
  if (!hora) return "N/A";
  
  // Si viene como "14:30:00" o "14:30"
  let horas, minutos;
  if (typeof hora === 'string') {
    const partes = hora.split(':');
    horas = parseInt(partes[0]);
    minutos = partes[1];
  } else if (hora instanceof Date) {
    horas = hora.getHours();
    minutos = hora.getMinutes().toString().padStart(2, '0');
  } else {
    return hora;
  }
  
  const periodo = horas >= 12 ? 'PM' : 'AM';
  let horas12 = horas % 12;
  if (horas12 === 0) horas12 = 12;
  
  return `${horas12}:${minutos} ${periodo}`;
};

// ============================
// Mapeo de días
// Backend: 0=Lunes, 1=Martes, 2=Miércoles, 3=Jueves, 4=Viernes, 5=Sábado, 6=Domingo
// JavaScript: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
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

// Convertir fecha de JavaScript a día del backend
export const getBackendDay = (date) => {
  if (!date) return null;
  const jsDay = date.getDay();
  if (jsDay === 0) return 6;
  return jsDay - 1;
};

// Convertir día del backend a nombre para mostrar
export const getDayName = (backendDay) => {
  return diasSemanaMap[backendDay] || "Día desconocido";
};

// ============================
// Validar fecha (no anterior a hoy)
// ============================
export const validateFecha = (fecha) => {
  if (!fecha) {
    return { isValid: false, message: "Seleccione una fecha" };
  }
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const fechaComparar = new Date(fecha);
  fechaComparar.setHours(0, 0, 0, 0);
  
  if (fechaComparar < hoy) {
    return { isValid: false, message: "La fecha no puede ser anterior a hoy" };
  }
  
  return { isValid: true, message: "" };
};

// ============================
// Validar hora con fecha (no anterior a la hora actual si es hoy)
// ============================
export const validateHoraConFecha = (fecha, hora) => {
  if (!fecha || !hora) {
    return { isValid: false, message: "Seleccione fecha y hora" };
  }
  
  const ahora = new Date();
  const fechaHoraSeleccionada = new Date(fecha);
  
  let horas, minutos;
  if (hora instanceof Date) {
    horas = hora.getHours();
    minutos = hora.getMinutes();
  } else if (typeof hora === 'string') {
    const [h, m] = hora.split(':');
    horas = parseInt(h);
    minutos = parseInt(m);
  } else {
    return { isValid: false, message: "Hora inválida" };
  }
  
  fechaHoraSeleccionada.setHours(horas, minutos, 0, 0);
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  if (fechaHoraSeleccionada >= hoy && fechaHoraSeleccionada < ahora) {
    return { isValid: false, message: "La hora no puede ser anterior a la hora actual" };
  }
  
  return { isValid: true, message: "" };
};

// ============================
// Validar hora (básica)
// ============================
export const validateHora = (hora) => {
  if (!hora) {
    return { isValid: false, message: "Seleccione una hora" };
  }
  return { isValid: true, message: "" };
};

// ============================
// Validar duración (SIN validación de mínimo/máximo)
// ============================
export const validateDuracion = (duracion) => {
  if (!duracion) {
    return { isValid: false, message: "Ingrese la duración" };
  }
  // Validación de mínimo/máximo ELIMINADA - ahora acepta cualquier duración
  // Solo verifica que exista un valor
  return { isValid: true, message: "" };
};

// ============================
// Normalizar cita para formulario
// ============================
export const normalizeCitaForForm = (cita) => ({
  id: cita.id,
  cliente_id: cita.cliente_id || "",
  servicio_id: cita.servicio_id || "",
  empleado_id: cita.empleado_id || "",
  estado_cita_id: cita.estado_cita_id || "",
  metodo_pago: cita.metodo_pago || "",
  fecha: cita.fecha ? (() => {
    const [year, month, day] = cita.fecha.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  })() : null,
  hora: cita.hora ? (() => {
    const [h, m] = cita.hora.split(":");
    const d = new Date();
    d.setHours(parseInt(h), parseInt(m), 0);
    return d;
  })() : null,
  duracion: cita.duracion || 30,
});

// ============================
// Normalizar citas para listado
// ============================
export const normalizeCitasForList = (citas = [], estadosCita = []) => {
  return citas.map((c) => ({
    ...c,
    fecha_formateada: formatFecha(c.fecha),
    hora_formateada: formatHora(c.hora),
    estado: c.estado_nombre || "N/A",
    estadosDisponibles: estadosCita.map(e => e.nombre),
  }));
};

// ============================
// Opciones de método de pago
// ============================
export const metodoPagoOptions = [
  { value: "", label: "-- Seleccione método --" },
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta", label: "Tarjeta" },
  { value: "Transferencia", label: "Transferencia" },
];