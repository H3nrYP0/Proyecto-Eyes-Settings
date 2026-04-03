// Convierte el estado booleano a string
export const normalizarEstado = (estado) =>
  estado === true ? 'activo' : 'inactivo';

// Extrae los IDs de los permisos (por si vienen como objetos)
export const normalizarPermisosIds = (permisos = []) =>
  permisos.map((p) => p.id ?? p);

// Normaliza el initialData antes de cargarlo al formulario
export const normalizarInitialData = (data) => ({
  nombre:      data.nombre      ?? '',
  descripcion: data.descripcion ?? '',
  estado:      normalizarEstado(data.estado),
  permisos:    normalizarPermisosIds(data.permisos),
});

// Normaliza un rol de la lista
export const normalizarRol = (r) => ({
  ...r,
  estado:              normalizarEstado(r.estado),
  permisosCount:       r.permisos?.length ?? 0,
  estadosDisponibles:  ['activo', 'inactivo'],
});

// Normaliza un array de roles
export const normalizarRoles = (arr) => arr.map(normalizarRol);