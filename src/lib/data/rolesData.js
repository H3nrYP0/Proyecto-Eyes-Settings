// Base de datos temporal de roles
let rolesDB = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso total al sistema con todos los permisos disponibles para gestionar toda la óptica",
    permisos: ['dashboard', 'categorias', 'compras', 'empleados', 'ventas', 'roles', 'productos', 'servicios', 'clientes', 'campanas_salud', 'usuarios', 'proveedores', 'agenda', 'pedidos'],
    permisosCount: 14, // Agregar contador
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Vendedor",
    descripcion: "Gestiona ventas, clientes y procesos comerciales de la óptica",
    permisos: ['ventas', 'clientes', 'productos', 'servicios', 'agenda', 'pedidos'],
    permisosCount: 6, // Agregar contador
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Optometrista",
    descripcion: "Administra servicios médicos, agenda de citas y exámenes visuales",
    permisos: ['servicios', 'clientes', 'campanas_salud', 'agenda'],
    permisosCount: 4, // Agregar contador
    estado: "activo",
  },
  {
    id: 4,
    nombre: "Recepcionista",
    descripcion: "Atención al cliente, gestión de citas y apoyo administrativo",
    permisos: ['clientes', 'agenda', 'pedidos'],
    permisosCount: 3, // Agregar contador
    estado: "activo",
  },
  {
    id: 5,
    nombre: "Técnico",
    descripcion: "Manejo de inventario, ajuste de monturas y mantenimiento de equipos",
    permisos: ['productos', 'compras'],
    permisosCount: 2, // Agregar contador
    estado: "activo",
  },
];

// Obtener todos los roles
export function getAllRoles() {
  return [...rolesDB];
}

// Obtener por ID
export function getRolById(id) {
  const idNum = parseInt(id);
  return rolesDB.find((r) => r.id === idNum);
}

// Crear rol
export function createRol(data) {
  const newId = rolesDB.length ? rolesDB.at(-1).id + 1 : 1;
  const nuevoRol = { 
    id: newId, 
    permisosCount: data.permisos ? data.permisos.length : 0, // Calcular contador
    ...data 
  };
  
  rolesDB.push(nuevoRol);
  return nuevoRol;
}

// Actualizar rol
export function updateRol(id, updated) {
  const idNum = parseInt(id);
  const index = rolesDB.findIndex((r) => r.id === idNum);
  
  if (index !== -1) {
    // Actualizar contador de permisos si se modifican los permisos
    const updatedWithCount = {
      ...updated,
      permisosCount: updated.permisos ? updated.permisos.length : rolesDB[index].permisosCount
    };
    
    rolesDB[index] = { ...rolesDB[index], ...updatedWithCount };
    return rolesDB[index];
  }
  return null;
}

// Eliminar rol
export function deleteRol(id) {
  const idNum = parseInt(id);
  rolesDB = rolesDB.filter((r) => r.id !== idNum);
  return rolesDB;
}