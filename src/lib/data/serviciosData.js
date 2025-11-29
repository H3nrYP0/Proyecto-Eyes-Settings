// Base de datos temporal de servicios
let serviciosDB = [
  {
    id: 1,
    nombre: "Cita general",
    descripcion: "Consulta optométrica completa para evaluación visual",
    duracion: 30,
    precio: 50000,
    empleado: "Dr. Carlos Méndez",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Campaña de salud",
    descripcion: "Servicio especial de campañas de salud visual",
    duracion: 45,
    precio: 80000,
    empleado: "Dra. Ana Rodríguez",
    estado: "activo",
  },
];

// Obtener todos los servicios
export function getAllServicios() {
  return [...serviciosDB];
}

// Obtener por ID
export function getServicioById(id) {
  return serviciosDB.find((s) => s.id === id);
}

// Crear servicio
export function createServicio(data) {
  const newId = serviciosDB.length ? serviciosDB.at(-1).id + 1 : 1;
  const nuevoServicio = { 
    id: newId, 
    ...data 
  };
  
  serviciosDB.push(nuevoServicio);
  return nuevoServicio;
}

// Actualizar servicio
export function updateServicio(id, updated) {
  const index = serviciosDB.findIndex((s) => s.id === id);
  if (index !== -1) {
    serviciosDB[index] = { ...serviciosDB[index], ...updated };
  }
  return serviciosDB;
}

// Eliminar servicio
export function deleteServicio(id) {
  serviciosDB = serviciosDB.filter((s) => s.id !== id);
  return serviciosDB;
}

// Cambiar estado
export function updateEstadoServicio(id) {
  serviciosDB = serviciosDB.map((s) =>
    s.id === id
      ? { 
          ...s, 
          estado: s.estado === "activo" ? "inactivo" : "activo" 
        }
      : s
  );
  return serviciosDB;
}