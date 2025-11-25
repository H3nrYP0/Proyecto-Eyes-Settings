// Base de datos temporal de agenda
let agendaDB = [
  {
    id: 1,
    cliente: "María González",
    servicio: "Examen de la Vista",
    empleado: "Dr. Carlos Méndez",
    fecha: "2024-01-15",
    hora: "09:00",
    duracion: 30,
    metodo_pago: "Efectivo",
    estado: "completada",
  },
  {
    id: 2,
    cliente: "Juan Pérez",
    servicio: "Adaptación Lentes de Contacto",
    empleado: "Dra. Ana Rodríguez",
    fecha: "2024-01-16",
    hora: "10:30",
    duracion: 45,
    metodo_pago: "Tarjeta",
    estado: "pendiente",
  },
  {
    id: 3,
    cliente: "Ana López",
    servicio: "Limpieza y Ajuste de Monturas",
    empleado: "Técnico Javier López",
    fecha: "2024-01-17",
    hora: "14:00",
    duracion: 15,
    metodo_pago: "",
    estado: "pendiente",
  },
];

// Obtener todas las citas
export function getAllAgenda() {
  return [...agendaDB];
}

// Obtener por ID
export function getAgendaById(id) {
  return agendaDB.find((a) => a.id === id);
}

// Crear cita
export function createAgenda(data) {
  const newId = agendaDB.length ? agendaDB.at(-1).id + 1 : 1;
  const nuevaCita = { 
    id: newId, 
    ...data 
  };
  
  agendaDB.push(nuevaCita);
  return nuevaCita;
}

// Actualizar cita
export function updateAgenda(id, updated) {
  const index = agendaDB.findIndex((a) => a.id === id);
  if (index !== -1) {
    agendaDB[index] = { ...agendaDB[index], ...updated };
  }
  return agendaDB;
}

// Eliminar cita
export function deleteAgenda(id) {
  agendaDB = agendaDB.filter((a) => a.id !== id);
  return agendaDB;
}

// Cambiar estado
export function updateEstadoAgenda(id) {
  agendaDB = agendaDB.map((a) =>
    a.id === id
      ? { 
          ...a, 
          estado: a.estado === "pendiente" ? "completada" : 
                 a.estado === "completada" ? "cancelada" : "pendiente"
        }
      : a
  );
  return agendaDB;
}