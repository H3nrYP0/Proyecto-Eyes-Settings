// Base de datos temporal de horarios
let horariosDB = [
  {
    id: 1,
    empleadoId: 1,
    empleadoNombre: "Dr. Carlos Méndez",
    tipo: "regular", // regular, especial, vacaciones
    dias: ["lunes", "martes", "miercoles", "jueves", "viernes"],
    horaInicio: "08:00",
    horaFinal: "17:00",
    descansoInicio: "12:00",
    descansoFinal: "13:00",
    fechaInicio: "2024-01-01",
    fechaFin: null, // null para horarios permanentes
    estado: "activo"
  },
  {
    id: 2,
    empleadoId: 2,
    empleadoNombre: "Dra. Ana Rodríguez",
    tipo: "regular",
    dias: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
    horaInicio: "09:00",
    horaFinal: "18:00",
    descansoInicio: "13:00",
    descansoFinal: "14:00",
    fechaInicio: "2024-01-01",
    fechaFin: null,
    estado: "activo"
  }
];

// Horarios especiales
let horariosEspecialesDB = [
  {
    id: 1,
    empleadoId: 1,
    tipo: "vacaciones",
    fechaInicio: "2024-12-20",
    fechaFin: "2024-12-31",
    motivo: "Vacaciones de fin de año",
    estado: "activo"
  }
];

// Listas para selects
export const diasSemana = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miercoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" }
];

export const tiposHorario = [
  { value: "regular", label: "Horario Regular" },
  { value: "especial", label: "Horario Especial" },
  { value: "vacaciones", label: "Vacaciones" },
  { value: "permiso", label: "Permiso" }
];

// Obtener horarios por empleado
export function getHorariosByEmpleado(empleadoId) {
  return horariosDB.filter(h => h.empleadoId === empleadoId && h.estado === "activo");
}

// Obtener horarios especiales por empleado
export function getHorariosEspecialesByEmpleado(empleadoId) {
  return horariosEspecialesDB.filter(h => h.empleadoId === empleadoId && h.estado === "activo");
}

// Verificar disponibilidad para una cita
export function verificarDisponibilidad(empleadoId, fecha, hora) {
  const fechaObj = new Date(fecha);
  const diaSemana = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
  
  // Buscar horarios regulares
  const horariosRegulares = getHorariosByEmpleado(empleadoId);
  const horarioDelDia = horariosRegulares.find(h => 
    h.dias.includes(diaSemana) && 
    hora >= h.horaInicio && 
    hora <= h.horaFinal
  );
  
  if (!horarioDelDia) return false;
  
  // Verificar si está en horario de descanso
  if (hora >= horarioDelDia.descansoInicio && hora <= horarioDelDia.descansoFinal) {
    return false;
  }
  
  // Verificar horarios especiales (vacaciones, permisos)
  const horariosEspeciales = getHorariosEspecialesByEmpleado(empleadoId);
  const tieneHorarioEspecial = horariosEspeciales.some(h => {
    const inicio = new Date(h.fechaInicio);
    const fin = new Date(h.fechaFin);
    return fechaObj >= inicio && fechaObj <= fin;
  });
  
  return !tieneHorarioEspecial;
}

// ... mantener las otras funciones (create, update, delete, etc.)

// Crear horario
export function createHorario(data) {
  const newId = horariosDB.length ? horariosDB.at(-1).id + 1 : 1;
  
  // Calcular duración automáticamente
  const duracion = calcularDuracion(data.horaInicio, data.horaFinal);
  
  const nuevoHorario = { 
    id: newId, 
    ...data,
    duracion 
  };
  
  horariosDB.push(nuevoHorario);
  return nuevoHorario;
}

// Actualizar horario
export function updateHorario(id, updated) {
  const index = horariosDB.findIndex((h) => h.id === id);
  if (index !== -1) {
    // Recalcular duración si cambian las horas
    const duracion = calcularDuracion(
      updated.horaInicio || horariosDB[index].horaInicio,
      updated.horaFinal || horariosDB[index].horaFinal
    );
    
    horariosDB[index] = { 
      ...horariosDB[index], 
      ...updated,
      duracion 
    };
  }
  return horariosDB;
}

// Eliminar horario
export function deleteHorario(id) {
  horariosDB = horariosDB.filter((h) => h.id !== id);
  return horariosDB;
}

// Cambiar estado
export function updateEstadoHorario(id) {
  horariosDB = horariosDB.map((h) =>
    h.id === id
      ? { 
          ...h, 
          estado: h.estado === "activo" ? "inactivo" : "activo" 
        }
      : h
  );
  return horariosDB;
}