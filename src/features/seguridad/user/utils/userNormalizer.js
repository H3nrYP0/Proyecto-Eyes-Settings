// Normaliza usuario para la tabla
export const normalizeUser = (user) => ({
  id: user.id,
  correo: user.correo,
  nombre: user.nombre || user.empleado?.nombre || 'Sin nombre',
  apellido: user.empleado?.apellido || '',
  rol_id: user.rol_id,
  rol_nombre: user.rol_nombre,
  empleado_id: user.empleado_id,
  estado: user.estado ? 'activo' : 'inactivo',
  estadosDisponibles: ['activo', 'inactivo'],
});

export const normalizeUsers = (users) => {
  if (!Array.isArray(users)) return [];
  return users.map(normalizeUser);
};

// Normaliza datos del backend para el formulario
export const normalizeUserInitialData = (data) => ({
  id: data.id,
  correo: data.correo ?? '',
  rol_id: data.rol_id ?? '',
  empleado_id: data.empleado_id ?? '',
  empleado_nombre: data.empleado?.nombre ?? '',
  empleado_documento: data.empleado?.numero_documento ?? '',
  estado: data.estado ?? true,
});

// Payload para crear
export const buildCreatePayload = (data) => ({
  correo: data.correo,
  contrasenia: data.contrasenia,
  rol_id: Number(data.rol_id),
  empleado_id: Number(data.empleado_id),
  estado: true,
});

// Payload para actualizar
export const buildUpdatePayload = (data) => {
  const payload = {
    correo: data.correo,
    rol_id: Number(data.rol_id),
    estado: data.estado,
  };
  if (data.contrasenia && data.contrasenia !== '') {
    payload.contrasenia = data.contrasenia;
  }
  return payload;
};