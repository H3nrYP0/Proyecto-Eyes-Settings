export const normalizarRolEstado = (estado) =>
  estado === true ? 'activo' : 'inactivo';

export const normalizarPermisosIds = (permisos = []) =>
  permisos.map((p) => p.id ?? p);

export const normalizarRolInitialData = (data) => ({
  nombre:      data.nombre      ?? '',
  descripcion: data.descripcion ?? '',
  estado:      normalizarRolEstado(data.estado),
  permisos:    normalizarPermisosIds(data.permisos),
});

export const normalizarRol = (r) => ({
  ...r,
  estado:              normalizarRolEstado(r.estado),
  permisosCount:       r.permisos?.length ?? 0,
  estadosDisponibles:  ['activo', 'inactivo'],
});

export const normalizarRoles = (arr) => arr.map(normalizarRol);