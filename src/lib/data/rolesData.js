// Base de datos temporal de roles
let rolesDB = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso total al sistema con todos los permisos disponibles para gestionar toda la óptica",
    permisos: ['dashboard', 'categorias', 'compras', 'empleados', 'ventas', 'roles', 'productos', 'servicios', 'clientes', 'campanas_salud', 'usuarios', 'proveedores', 'agenda', 'pedidos'], // Cambiado a array
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Vendedor",
    descripcion: "Gestiona ventas, clientes y procesos comerciales de la óptica",
    permisos: ['ventas', 'clientes', 'productos', 'servicios', 'agenda', 'pedidos'], // Cambiado a array
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Optometrista",
    descripcion: "Administra servicios médicos, agenda de citas y exámenes visuales",
    permisos: ['servicios', 'clientes', 'campanas_salud', 'agenda'], // Cambiado a array
    estado: "activo",
  },
  {
    id: 4,
    nombre: "Recepcionista",
    descripcion: "Atención al cliente, gestión de citas y apoyo administrativo",
    permisos: ['clientes', 'agenda', 'pedidos'], // Cambiado a array
    estado: "activo",
  },
  {
    id: 5,
    nombre: "Técnico",
    descripcion: "Manejo de inventario, ajuste de monturas y mantenimiento de equipos",
    permisos: ['productos', 'compras'], // Cambiado a array
    estado: "activo",
  },
];

// Obtener todos los roles
export function getAllRoles() {
  // Para mantener compatibilidad con la tabla que muestra "X permisos"
  return rolesDB.map(rol => ({
    ...rol,
    permisosCount: rol.permisos ? rol.permisos.length : 0 // Agregar contador
  }));
}

// Obtener por ID
export function getRolById(id) {
  // Convertir id a número ya que en la DB los IDs son números
  const idNum = parseInt(id);
  return rolesDB.find((r) => r.id === idNum);
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
  const idNum = parseInt(id);
  const index = rolesDB.findIndex((r) => r.id === idNum);
  if (index !== -1) {
    rolesDB[index] = { ...rolesDB[index], ...updated }; // Corregido: } en lugar de ]
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