// Convierte cualquier estado (booleano, número, string) a 'activo' o 'inactivo'
export const normalizarRolEstado = (estado) => {
  if (typeof estado === 'string') {
    return estado === 'activo' ? 'activo' : 'inactivo';
  }
  if (typeof estado === 'boolean') {
    return estado ? 'activo' : 'inactivo';
  }
  if (typeof estado === 'number') {
    return estado === 1 ? 'activo' : 'inactivo';
  }
  return 'inactivo'; // fallback seguro
};

// Normaliza un rol individual
export const normalizarRol = (rol) => ({
  ...rol,
  estado: normalizarRolEstado(rol.estado),
  permisosCount: rol.permisos?.length ?? 0,
  estadosDisponibles: ['activo', 'inactivo'],
});

// Normaliza una lista de roles
export const normalizarRoles = (roles) => {
  if (!Array.isArray(roles)) return [];
  return roles.map(normalizarRol);
};

// Normaliza los datos iniciales para el formulario (crear/editar)
export const normalizarRolInitialData = (data) => ({
  id: data.id,
  nombre: data.nombre ?? '',
  descripcion: data.descripcion ?? '',
  estado: normalizarRolEstado(data.estado),
  permisos: (data.permisos ?? []).map((p) => p.id ?? p),
});

// Construye payload para creación (el backend espera booleano o string según tu API)
// Ajusta según lo que espere tu backend: si espera booleano, usa estado === 'activo'
export const buildRolCreatePayload = (data) => ({
  nombre: data.nombre,
  descripcion: data.descripcion,
  estado: data.estado === 'activo',   // convierte a booleano si el backend lo requiere
  permisos: data.permisos,
});

// Para actualización
export const buildRolUpdatePayload = (data) => ({
  nombre: data.nombre,
  descripcion: data.descripcion,
  estado: data.estado === 'activo',
  permisos: data.permisos,
});