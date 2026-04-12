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
// FORMATEO DE HORAS
// ============================
export const formatHora = (hora) => {
  if (!hora) return "";
  return hora.substring(0, 5);
};

// ============================
// NORMALIZACIÓN DE HORARIO
// ============================
export const normalizeHorarioForForm = (horario, empleados = []) => {
  const empleado = empleados.find(e => e.id === horario.empleado_id);
  const diaNombre = diasSemanaMap[horario.dia] || "Desconocido";
  
  return {
    id: horario.id,
    empleado_id: horario.empleado_id,
    empleado_nombre: empleado?.nombre || "Desconocido",
    dia: horario.dia,
    dia_nombre: diaNombre,
    hora_inicio: formatHora(horario.hora_inicio),
    hora_inicio_completa: horario.hora_inicio,
    hora_final: formatHora(horario.hora_final),
    hora_final_completa: horario.hora_final,
    activo: horario.activo ?? true,
    estado: horario.activo ? "activo" : "inactivo",
    estadosDisponibles: ["activo", "inactivo"], // ← agregar esta línea
    descripcion: `${empleado?.nombre || "Empleado"} - ${diaNombre} ${formatHora(horario.hora_inicio)}`
  };
};

export const normalizeHorariosForList = (horarios = [], empleados = []) => {
  return horarios.map(h => normalizeHorarioForForm(h, empleados));
};

