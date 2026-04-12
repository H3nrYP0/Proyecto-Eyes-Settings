export const tiposNovedad = [
  { value: "vacaciones", label: "Vacaciones" },
  { value: "incapacidad", label: "Incapacidad" },
  { value: "permiso", label: "Permiso" },
  { value: "licencia", label: "Licencia" },
  { value: "otro", label: "Otro" },
];

export const formatFecha = (fecha) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES");
};

export const formatHora = (hora) => {
  if (!hora) return "";
  const [h, m] = hora.split(":");
  return `${h}:${m}`;
};

export const normalizeNovedadForList = (novedad, empleados = []) => {
  const empleado = empleados.find(e => e.id === novedad.empleado_id);
  const fechaInicio = formatFecha(novedad.fecha_inicio);
  const fechaFin = formatFecha(novedad.fecha_fin);
  const fechas_display = fechaInicio === fechaFin ? fechaInicio : `${fechaInicio} - ${fechaFin}`;
  const rangoHoras = novedad.hora_inicio && novedad.hora_fin
    ? `${formatHora(novedad.hora_inicio)} - ${formatHora(novedad.hora_fin)}`
    : "Todo el día";
  const descripcion = `${empleado?.nombre || "Empleado"} - ${novedad.tipo}: ${fechas_display} (${rangoHoras})`;

  return {
    id: novedad.id,
    empleado_id: novedad.empleado_id,
    empleado_nombre: empleado?.nombre || "Desconocido",
    // Campos originales para edición/vista
    fecha_inicio: novedad.fecha_inicio,
    fecha_fin: novedad.fecha_fin,
    hora_inicio: novedad.hora_inicio,
    hora_fin: novedad.hora_fin,
    tipo: novedad.tipo,
    motivo: novedad.motivo,
    activo: novedad.activo,
    // Campos para mostrar
    fechas_display,
    rango_horas: rangoHoras,
    tipo_label: tiposNovedad.find(t => t.value === novedad.tipo)?.label || novedad.tipo,
    estado: novedad.activo ? "activo" : "inactivo",
    estadosDisponibles: ["activo", "inactivo"],   // necesario para el botón de cambio de estado
    descripcion,
  };
};

export const normalizeNovedadesForList = (novedades = [], empleados = []) => {
  return novedades.map(n => normalizeNovedadForList(n, empleados));
};