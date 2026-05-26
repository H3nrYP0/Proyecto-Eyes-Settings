/**
 * Utilidades para normalizar roles y permisos.
 * - Convierte estado a 'activo'/'inactivo'.
 * - Extrae array de IDs de permisos.
 * - Construye payload para creación/actualización (envía booleano para estado y array de IDs).
 */

export const normalizarRolEstado = (estado) => {
  if (typeof estado === "string") {
    return estado === "activo" ? "activo" : "inactivo";
  }
  if (typeof estado === "boolean") {
    return estado ? "activo" : "inactivo";
  }
  if (typeof estado === "number") {
    return estado === 1 ? "activo" : "inactivo";
  }
  return "inactivo";
};

export const normalizarRol = (rol) => ({
  ...rol,
  estado: normalizarRolEstado(rol.estado),
  permisosCount: rol.permisos?.length ?? 0,
  estadosDisponibles: ["activo", "inactivo"],
});

export const normalizarRoles = (roles) => {
  if (!Array.isArray(roles)) return [];
  return roles.map(normalizarRol);
};

export const normalizarRolInitialData = (data) => ({
  id: data.id,
  nombre: data.nombre ?? "",
  descripcion: data.descripcion ?? "",
  estado: normalizarRolEstado(data.estado),
  permisos: (data.permisos ?? []).map((p) => p.id ?? p), // extrae IDs
});

export const buildRolCreatePayload = (data) => ({
  nombre: data.nombre,
  descripcion: data.descripcion,
  estado: data.estado === "activo", // booleano para el backend
  permisos: data.permisos, // array de IDs
});

export const buildRolUpdatePayload = (data) => ({
  nombre: data.nombre,
  descripcion: data.descripcion,
  estado: data.estado === "activo",
  permisos: data.permisos,
});