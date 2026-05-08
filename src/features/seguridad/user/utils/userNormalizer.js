// Para la tabla (GestionUsuarios)
export const normalizeUser = (user) => ({
  id:         user.id,
  nombre:     user.nombre || "Sin nombre",
  correo:     user.correo,
  rol_id:     user.rol_id,
  rol_nombre: user.rol_nombre,
  estado:     user.estado ? "activo" : "inactivo",
  estadosDisponibles: ["activo", "inactivo"],
});

export const normalizeUsers = (users) => {
  if (!Array.isArray(users)) return [];
  return users.map(normalizeUser);
};

// Para formularios (Detalle / Editar)
export const normalizeUserInitialData = (data) => ({
  id:     data.id,
  nombre: data.nombre ?? "",
  correo: data.correo ?? "",
  rol_id: data.rol_id ?? "",
  estado: data.estado ?? true,
});