// Convierte el estado booleano a string (o lo deja si ya es string)
export const normalizarEstado = (estado) => {
  if (estado === true)  return 'activo';
  if (estado === false) return 'inactivo';
  return estado ?? 'inactivo';
};

// Extrae los IDs de los permisos (por si vienen como objetos)
export const normalizarPermisosIds = (permisos = []) =>
  permisos.map((p) => p.id ?? p);

// Normaliza el initialData antes de cargarlo al formulario
export const normalizarInitialData = (data) => ({
  id:          data.id,          
  nombre:      data.nombre      ?? '',
  descripcion: data.descripcion ?? '',
  estado:      normalizarEstado(data.estado),
  permisos:    normalizarPermisosIds(data.permisos),
});

// Normaliza un rol de la lista
export const normalizarRol = (r) => ({
  ...r,
  estado:             normalizarEstado(r.estado),
  permisosCount:      r.permisos?.length ?? 0,
  estadosDisponibles: ['activo', 'inactivo'],
});

// Normaliza un array de roles
export const normalizarRoles = (arr) => arr.map(normalizarRol);

// Prepara el formData para enviarlo al backend (formulario → backend)
export const prepararPayloadRol = (formData) => ({
  nombre:      formData.nombre,
  descripcion: formData.descripcion,
  estado:      formData.estado === 'activo',
  permisos:    formData.permisos,
});