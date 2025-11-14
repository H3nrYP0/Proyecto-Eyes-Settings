let agendaDB = [
  {
    id: 1,
    cliente: "Laura Martínez",
    servicio: "Examen de la Vista",
    fecha: "2024-01-20",
    hora: "09:00 AM",
    duracion: "30 min",
    metodoPago: "Efectivo",
    estado: "pendiente",
  },
  {
    id: 2,
    cliente: "Roberto Silva",
    servicio: "Adaptación Lentes",
    fecha: "2024-01-19",
    hora: "02:30 PM",
    duracion: "45 min",
    metodoPago: "Tarjeta Crédito",
    estado: "completada",
  },
  {
    id: 3,
    cliente: "María González",
    servicio: "Limpieza y Ajuste",
    fecha: "2024-01-18",
    hora: "11:00 AM",
    duracion: "15 min",
    metodoPago: "Efectivo",
    estado: "cancelada",
  },
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
  const nueva = { id: newId, ...data };
  agendaDB.push(nueva);
  return nueva;
}

// Actualizar
export function updateAgenda(id, updated) {
  const index = agendaDB.findIndex((c) => c.id === id);
  if (index !== -1) {
    agendaDB[index] = { ...agendaDB[index], ...updated };
  }
  return agendaDB;
}

// Eliminar
export function deleteAgenda(id) {
  agendaDB = agendaDB.filter((c) => c.id !== id);
  return agendaDB;
}

// Cambiar estado
export function updateEstadoAgenda(id) {
  agendaDB = agendaDB.map((c) =>
    c.id === id
      ? {
          ...c,
          estado:
            c.estado === "pendiente"
              ? "completada"
              : c.estado === "completada"
              ? "cancelada"
              : "pendiente",
        }
      : c
  );
  return agendaDB;
}
