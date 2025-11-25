// Base de datos temporal de horarios
let horariosDB = [
  {
    id: 1,
    empleado: "Carlos Méndez",
    dia: "Lunes a Viernes",
    horaInicio: "08:00",
    horaFinal: "17:00",
    duracion: "9 horas",
    estado: "activo",
  },
  {
    id: 2,
    empleado: "Ana Rodríguez",
    dia: "Lunes a Sábado",
    horaInicio: "09:00",
    horaFinal: "18:00",
    duracion: "9 horas",
    estado: "activo",
  },
  {
    id: 3,
    empleado: "Javier López",
    dia: "Martes a Domingo",
    horaInicio: "10:00",
    horaFinal: "19:00",
    duracion: "9 horas",
    estado: "activo",
  },
  {
    id: 4,
    empleado: "Carlos Méndez",
    dia: "Sábado",
    horaInicio: "08:00",
    horaFinal: "12:00",
    duracion: "4 horas",
    estado: "inactivo",
  },
];

// Lista de empleados (para el select)
export const empleadosList = [
  "Carlos Méndez",
  "Ana Rodríguez", 
  "Javier López",
  "María González",
  "Roberto Silva",
  "Laura Martínez"
];

// Días disponibles
export const diasList = [
  "Lunes",
  "Martes", 
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
  "Lunes a Viernes",
  "Lunes a Sábado",
  "Sábado y Domingo"
];

// Calcular duración automáticamente
function calcularDuracion(horaInicio, horaFinal) {
  const inicio = new Date(`2000-01-01T${horaInicio}`);
  const final = new Date(`2000-01-01T${horaFinal}`);
  const diffMs = final - inicio;
  const diffHoras = diffMs / (1000 * 60 * 60);
  
  if (diffHoras < 0) {
    return "0 horas"; // Horario inválido
  }
  
  return `${diffHoras} horas`;
}

// Obtener todos los horarios
export function getAllHorarios() {
  return [...horariosDB];
}

// Obtener por ID
export function getHorarioById(id) {
  return horariosDB.find((h) => h.id === id);
}

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