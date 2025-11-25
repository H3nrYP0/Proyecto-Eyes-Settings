// Base de datos temporal de roles
let rolesDB = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso total al sistema con todos los permisos disponibles para gestionar toda la óptica",
    permisos: 25,
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Vendedor",
    descripcion: "Gestiona ventas, clientes y procesos comerciales de la óptica",
    permisos: 12,
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Optometrista",
    descripcion: "Administra servicios médicos, agenda de citas y exámenes visuales",
    permisos: 15,
    estado: "activo",
  },
  {
    id: 4,
    nombre: "Recepcionista",
    descripcion: "Atención al cliente, gestión de citas y apoyo administrativo",
    permisos: 8,
    estado: "activo",
  },
  {
    id: 5,
    nombre: "Técnico",
    descripcion: "Manejo de inventario, ajuste de monturas y mantenimiento de equipos",
    permisos: 10,
    estado: "activo",
  },
];

// Obtener todos los roles
export function getAllRoles() {
  return [...rolesDB];
}

// Obtener por ID
export function getRolById(id) {
  return rolesDB.find((r) => r.id === id);
}

// Crear rol
export function createRol(data) {
  const newId = rolesDB.length ? rolesDB.at(-1).id + 1 : 1;
  const nuevoRol = { 
    id: newId, 
    ...data 
  };
  
  rolesDB.push(nuevoRol);
  return nuevoRol;
}

// Actualizar rol
export function updateRol(id, updated) {
  const index = rolesDB.findIndex((r) => r.id === id);
  if (index !== -1) {
    rolesDB[index] = { ...rolesDB[index], ...updated };
  }
  return rolesDB;
}

// Eliminar rol
export function deleteRol(id) {
  rolesDB = rolesDB.filter((r) => r.id !== id);
  return rolesDB;
}