// Base de datos temporal de accesos
let accesosDB = [
  {
    id: 1,
    usuario: "Juan Pérez",
    rol: "Administrador",
    modulosAcceso: "Todos los módulos",
    ultimoAcceso: "2024-01-20 09:15",
    estado: "activo",
  },
  {
    id: 2,
    usuario: "María González",
    rol: "Vendedor",
    modulosAcceso: "Ventas, Clientes, Productos",
    ultimoAcceso: "2024-01-20 10:30",
    estado: "activo",
  },
  {
    id: 3,
    usuario: "Carlos Méndez",
    rol: "Optometrista",
    modulosAcceso: "Servicios, Agenda, Clientes",
    ultimoAcceso: "2024-01-19 16:45",
    estado: "inactivo",
  },
  {
    id: 4,
    usuario: "Ana Rodríguez",
    rol: "Optometrista",
    modulosAcceso: "Servicios, Agenda, Clientes",
    ultimoAcceso: "2024-01-20 11:20",
    estado: "activo",
  },
  {
    id: 5,
    usuario: "Javier López",
    rol: "Técnico",
    modulosAcceso: "Inventario, Productos",
    ultimoAcceso: "2024-01-18 14:20",
    estado: "bloqueado",
  },
];

// Obtener todos los accesos
export function getAllAccesos() {
  return [...accesosDB];
}

// Obtener por ID
export function getAccesoById(id) {
  return accesosDB.find((a) => a.id === id);
}

// Crear acceso
export function createAcceso(data) {
  const newId = accesosDB.length ? accesosDB.at(-1).id + 1 : 1;
  const nuevoAcceso = { 
    id: newId, 
    ...data 
  };
  
  accesosDB.push(nuevoAcceso);
  return nuevoAcceso;
}

// Actualizar acceso
export function updateAcceso(id, updated) {
  const index = accesosDB.findIndex((a) => a.id === id);
  if (index !== -1) {
    accesosDB[index] = { ...accesosDB[index], ...updated };
  }
  return accesosDB;
}

// Eliminar acceso
export function deleteAcceso(id) {
  accesosDB = accesosDB.filter((a) => a.id !== id);
  return accesosDB;
}

// Cambiar estado
export function updateEstadoAcceso(id) {
  accesosDB = accesosDB.map((a) =>
    a.id === id
      ? { 
          ...a, 
          estado: a.estado === "activo" ? "inactivo" : 
                 a.estado === "inactivo" ? "bloqueado" : "activo"
        }
      : a
  );
  return accesosDB;
}