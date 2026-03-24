// ============================
// Formatear fecha para mostrar
// ============================
export const formatFecha = (fecha) => {
  if (!fecha) return "N/A";
  return new Date(fecha).toLocaleDateString("es-ES");
};

// ============================
// Formatear hora para mostrar
// ============================
export const formatHora = (hora) => {
  if (!hora) return "N/A";
  return hora.substring(0, 5);
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
  fecha: cita.fecha ? new Date(cita.fecha) : null,
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
// Validar fecha (no anterior a hoy)
// ============================
export const validateFecha = (fecha) => {
  if (!fecha) {
    return { isValid: false, message: "Seleccione una fecha" };
  }
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fecha < hoy) {
    return { isValid: false, message: "La fecha no puede ser anterior a hoy" };
  }
  
  return { isValid: true, message: "" };
};

// ============================
// Validar duración
// ============================
export const validateDuracion = (duracion) => {
  if (!duracion) {
    return { isValid: false, message: "Ingrese la duración" };
  }
  if (duracion < 15 || duracion > 180) {
    return { isValid: false, message: "Debe estar entre 15 y 180 minutos" };
  }
  return { isValid: true, message: "" };
};

// ============================
// Validar hora
// ============================
export const validateHora = (hora) => {
  if (!hora) {
    return { isValid: false, message: "Seleccione una hora" };
  }
  return { isValid: true, message: "" };
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