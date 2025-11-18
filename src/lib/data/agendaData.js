// Base de datos temporal de agenda
let agendaDB = [
  {
    id: 1,
    clienteId: 1,
    servicioId: 1,
    empleadoId: 1,
    metodo_pago: "Efectivo",
    hora: "09:00 AM",
    duracion: "30 min",
    fecha: "2024-01-20",
    estadoDeCitaId: 1,
    cliente: "Laura Martínez",
    servicio: "Examen de la Vista",
    empleado: "Carlos Méndez",  // ← AGREGADO
    estado: "pendiente"
  },
  {
    id: 2,
    clienteId: 2,
    servicioId: 2,
    empleadoId: 2,
    metodo_pago: "Tarjeta Crédito",
    hora: "02:30 PM",
    duracion: "45 min",
    fecha: "2024-01-19",
    estadoDeCitaId: 2,
    cliente: "Roberto Silva",
    servicio: "Adaptación Lentes",
    empleado: "Ana Rodríguez",  // ← AGREGADO
    estado: "completada"
  },
  {
    id: 3,
    clienteId: 3,
    servicioId: 3,
    empleadoId: 3,
    metodo_pago: "Efectivo",
    hora: "11:00 AM",
    duracion: "15 min",
    fecha: "2024-01-18",
    estadoDeCitaId: 3,
    cliente: "María González",
    servicio: "Limpieza y Ajuste",
    empleado: "Javier López",  // ← AGREGADO
    estado: "cancelada"
  }
];

// Datos maestros para los selects
export const clientesList = [
  { id: 1, nombre: "Laura Martínez" },
  { id: 2, nombre: "Roberto Silva" },
  { id: 3, nombre: "María González" },
  { id: 4, nombre: "Carlos Ramírez" },
  { id: 5, nombre: "Ana López" }
];

export const serviciosList = [
  { id: 1, nombre: "Examen de la Vista" },
  { id: 2, nombre: "Adaptación Lentes" },
  { id: 3, nombre: "Limpieza y Ajuste" },
  { id: 4, nombre: "Consulta Oftalmológica" },
  { id: 5, nombre: "Control de Presión Ocular" }
];

export const empleadosList = [
  { id: 1, nombre: "Carlos Méndez" },
  { id: 2, nombre: "Ana Rodríguez" },
  { id: 3, nombre: "Javier López" }
];

export const estadosCitaList = [
  { id: 1, nombre: "Pendiente" },
  { id: 2, nombre: "Confirmada" },
  { id: 3, nombre: "En Progreso" },
  { id: 4, nombre: "Completada" },
  { id: 5, nombre: "Cancelada" },
  { id: 6, nombre: "No Asistió" }
];

export const metodosPagoList = [
  "Efectivo",
  "Tarjeta Crédito",
  "Tarjeta Débito",
  "Transferencia",
  "PSE"
];

// Obtener todo
export function getAllAgenda() {
  return [...agendaDB];
}

// Obtener por ID
export function getAgendaById(id) {
  return agendaDB.find((c) => c.id === id);
}

// Crear
export function createAgenda(data) {
  const newId = agendaDB.length ? agendaDB.at(-1).id + 1 : 1;
  
  // Buscar nombres para los IDs
  const cliente = clientesList.find(c => c.id === parseInt(data.clienteId))?.nombre || "";
  const servicio = serviciosList.find(s => s.id === parseInt(data.servicioId))?.nombre || "";
  const empleado = empleadosList.find(e => e.id === parseInt(data.empleadoId))?.nombre || "";
  const estado = estadosCitaList.find(ec => ec.id === parseInt(data.estadoDeCitaId))?.nombre.toLowerCase() || "pendiente";
  
  const nuevaCita = { 
    id: newId, 
    ...data,
    cliente,
    servicio,
    empleado,  // ← ESTE CAMPO SE CREA AUTOMÁTICAMENTE
    estado
  };
  
  agendaDB.push(nuevaCita);
  return nuevaCita;
}

// Actualizar
export function updateAgenda(id, updated) {
  const index = agendaDB.findIndex((c) => c.id === id);
  if (index !== -1) {
    // Actualizar nombres si cambian los IDs
    if (updated.clienteId) {
      updated.cliente = clientesList.find(c => c.id === parseInt(updated.clienteId))?.nombre || agendaDB[index].cliente;
    }
    if (updated.servicioId) {
      updated.servicio = serviciosList.find(s => s.id === parseInt(updated.servicioId))?.nombre || agendaDB[index].servicio;
    }
    if (updated.empleadoId) {
      updated.empleado = empleadosList.find(e => e.id === parseInt(updated.empleadoId))?.nombre || agendaDB[index].empleado;
    }
    if (updated.estadoDeCitaId) {
      updated.estado = estadosCitaList.find(ec => ec.id === parseInt(updated.estadoDeCitaId))?.nombre.toLowerCase() || agendaDB[index].estado;
    }
    
    agendaDB[index] = { ...agendaDB[index], ...updated };
  }
  return agendaDB;
}

// Eliminar
export function deleteAgenda(id) {
  agendaDB = agendaDB.filter((c) => c.id !== id);
  return agendaDB;
}

// Cambiar estado (para mantener compatibilidad)
export function updateEstadoAgenda(id) {
  agendaDB = agendaDB.map((c) =>
    c.id === id
      ? {
          ...c,
          estado: c.estado === "pendiente" ? "completada" : c.estado === "completada" ? "cancelada" : "pendiente",
          estadoDeCitaId: c.estado === "pendiente" ? 4 : c.estado === "completada" ? 5 : 1
        }
      : c
  );
  return agendaDB;
}