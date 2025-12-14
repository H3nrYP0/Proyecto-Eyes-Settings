// Base de datos temporal de roles
let rolesDB = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso total al sistema con todos los permisos disponibles para gestionar toda la óptica",
    permisos: ['dashboard', 'categorias', 'compras', 'empleados', 'ventas', 'roles', 'productos', 'servicios', 'clientes', 'campanas_salud', 'usuarios', 'proveedores', 'agenda', 'pedidos'],
    permisosCount: 14,
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Vendedor",
    descripcion: "Gestiona ventas, clientes y procesos comerciales de la óptica",
    permisos: ['ventas', 'clientes', 'productos', 'servicios', 'agenda', 'pedidos'],
    permisosCount: 6,
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Optometrista",
    descripcion: "Administra servicios médicos, agenda de citas y exámenes visuales",
    permisos: ['servicios', 'clientes', 'campanas_salud', 'agenda'],
    permisosCount: 4,
    estado: "activo",
  },
  {
    id: 4,
    nombre: "Recepcionista",
    descripcion: "Atención al cliente, gestión de citas y apoyo administrativo",
    permisos: ['clientes', 'agenda', 'pedidos'],
    permisosCount: 3,
    estado: "activo",
  },
  {
    id: 5,
    nombre: "Técnico",
    descripcion: "Manejo de inventario, ajuste de monturas y mantenimiento de equipos",
    permisos: ['productos', 'compras'],
    permisosCount: 2,
    estado: "activo",
  },
];

// =============================
//      FUNCIONES CRUD
// =============================

// Obtener todos los roles
export function getAllRoles() {
  return [...rolesDB];
}

// Obtener por ID
export function getRolById(id) {
  const idNum = typeof id === 'string' ? parseInt(id) : id;
  return rolesDB.find((r) => r.id === idNum) || null;
}

// Crear rol
export function createRol(data) {
  // Encontrar el ID máximo actual
  const maxId = rolesDB.length > 0 
    ? Math.max(...rolesDB.map(r => r.id)) 
    : 0;
  const newId = maxId + 1;
  
  // Calcular contador de permisos
  const permisosCount = data.permisos ? data.permisos.length : 0;
  
  const nuevoRol = { 
    id: newId,
    nombre: data.nombre || '',
    descripcion: data.descripcion || '',
    permisos: data.permisos || [],
    permisosCount,
    estado: data.estado || 'activo'
  };
  
  rolesDB.push(nuevoRol);
  return { ...nuevoRol };
}

// Actualizar rol
export function updateRol(id, updated) {
  const idNum = typeof id === 'string' ? parseInt(id) : id;
  const index = rolesDB.findIndex((r) => r.id === idNum);
  
  if (index === -1) return null;
  
  // Calcular nuevo contador de permisos si se modifican
  const permisosCount = updated.permisos 
    ? updated.permisos.length 
    : rolesDB[index].permisosCount;
  
  const rolActualizado = {
    ...rolesDB[index],
    ...updated,
    permisosCount,
    id: rolesDB[index].id // Mantener el ID original
  };
  
  rolesDB[index] = rolActualizado;
  return { ...rolActualizado };
}

// Eliminar rol
export function deleteRol(id) {
  const idNum = typeof id === 'string' ? parseInt(id) : id;
  rolesDB = rolesDB.filter((r) => r.id !== idNum);
  return [...rolesDB];
}

// Cambiar estado del rol (activo/inactivo)
export function updateEstadoRol(id) {
  const idNum = typeof id === 'string' ? parseInt(id) : id;
  const index = rolesDB.findIndex((r) => r.id === idNum);
  
  if (index === -1) return [...rolesDB];
  
  const nuevoEstado = rolesDB[index].estado === "activo" ? "inactivo" : "activo";
  
  rolesDB[index] = { 
    ...rolesDB[index], 
    estado: nuevoEstado 
  };
  
  return [...rolesDB];
}

// Buscar rol por nombre
export function getRolByNombre(nombre) {
  return rolesDB.find((r) => 
    r.nombre.toLowerCase() === nombre.toLowerCase()
  ) || null;
}

// Verificar si un rol tiene un permiso específico
export function rolTienePermiso(rolId, permisoId) {
  const rol = getRolById(rolId);
  if (!rol || !rol.permisos) return false;
  return rol.permisos.includes(permisoId);
}

// Obtener todos los permisos disponibles
export function getPermisosDisponibles() {
  const todosPermisos = rolesDB.flatMap(rol => rol.permisos || []);
  return [...new Set(todosPermisos)]; // Eliminar duplicados
}

// =============================
//      FUNCIONES DE VALIDACIÓN
// =============================

// Validar datos del rol antes de crear/actualizar
export function validarDatosRol(data) {
  const errors = [];
  
  if (!data.nombre || data.nombre.trim().length < 2) {
    errors.push('El nombre del rol es requerido (mínimo 2 caracteres)');
  }
  
  if (!data.descripcion || data.descripcion.trim().length < 5) {
    errors.push('La descripción es requerida (mínimo 5 caracteres)');
  }
  
  if (!data.permisos || !Array.isArray(data.permisos) || data.permisos.length === 0) {
    errors.push('Debe asignar al menos un permiso al rol');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Verificar si un nombre de rol ya existe (excepto para un ID específico)
export function nombreRolExiste(nombre, excludeId = null) {
  return rolesDB.some(rol => {
    if (excludeId && rol.id === excludeId) return false;
    return rol.nombre.toLowerCase() === nombre.toLowerCase();
  });
}

// =============================
//      FUNCIONES DE UTILIDAD
// =============================

// Obtener roles activos
export function getRolesActivos() {
  return rolesDB.filter(rol => rol.estado === "activo");
}

// Obtener roles inactivos
export function getRolesInactivos() {
  return rolesDB.filter(rol => rol.estado === "inactivo");
}

// Contar total de roles
export function getTotalRoles() {
  return rolesDB.length;
}

// Obtener estadísticas de roles
export function getEstadisticasRoles() {
  const total = rolesDB.length;
  const activos = rolesDB.filter(r => r.estado === "activo").length;
  const inactivos = total - activos;
  
  // Calcular promedio de permisos por rol
  const totalPermisos = rolesDB.reduce((sum, rol) => sum + (rol.permisosCount || 0), 0);
  const promedioPermisos = total > 0 ? (totalPermisos / total).toFixed(1) : 0;
  
  return {
    total,
    activos,
    inactivos,
    promedioPermisos,
    totalPermisos
  };
}

// Reiniciar base de datos (solo para desarrollo/testing)
export function reiniciarBaseDeDatos() {
  rolesDB = [
    {
      id: 1,
      nombre: "Administrador",
      descripcion: "Acceso total al sistema con todos los permisos disponibles para gestionar toda la óptica",
      permisos: ['dashboard', 'categorias', 'compras', 'empleados', 'ventas', 'roles', 'productos', 'servicios', 'clientes', 'campanas_salud', 'usuarios', 'proveedores', 'agenda', 'pedidos'],
      permisosCount: 14,
      estado: "activo",
    },
    {
      id: 2,
      nombre: "Vendedor",
      descripcion: "Gestiona ventas, clientes y procesos comerciales de la óptica",
      permisos: ['ventas', 'clientes', 'productos', 'servicios', 'agenda', 'pedidos'],
      permisosCount: 6,
      estado: "activo",
    },
    {
      id: 3,
      nombre: "Optometrista",
      descripcion: "Administra servicios médicos, agenda de citas y exámenes visuales",
      permisos: ['servicios', 'clientes', 'campanas_salud', 'agenda'],
      permisosCount: 4,
      estado: "activo",
    },
    {
      id: 4,
      nombre: "Recepcionista",
      descripcion: "Atención al cliente, gestión de citas y apoyo administrativo",
      permisos: ['clientes', 'agenda', 'pedidos'],
      permisosCount: 3,
      estado: "activo",
    },
    {
      id: 5,
      nombre: "Técnico",
      descripcion: "Manejo de inventario, ajuste de monturas y mantenimiento de equipos",
      permisos: ['productos', 'compras'],
      permisosCount: 2,
      estado: "activo",
    },
  ];
  
  return [...rolesDB];
}