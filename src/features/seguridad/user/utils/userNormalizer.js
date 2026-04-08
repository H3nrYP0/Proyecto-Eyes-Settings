// ============================================
// NORMALIZADORES DE USUARIO
// ============================================

// Convierte estado booleano a string para la UI
export const normalizeUserEstado = (estado) => estado ? 'activo' : 'inactivo';

// Normaliza un usuario de la lista para la tabla
export const normalizeUser = (user) => ({
  ...user,
  estado: normalizeUserEstado(user.estado),
  estadosDisponibles: ['activo', 'inactivo'],
});

// Normaliza un array de usuarios
export const normalizeUsers = (users) => users.map(normalizeUser);

// Normaliza datos del backend para el formulario
export const normalizeUserInitialData = (data) => ({
  nombre: data.nombre ?? '',
  email: data.correo ?? '',
  telefono: data.telefono ?? '',
  fechaNacimiento: data.fecha_nacimiento ?? '',
  tipoDocumento: data.tipo_documento ?? '',
  numeroDocumento: data.numero_documento ?? '',
  password: '',
  confirmPassword: '',
  rol: data.rol_id ?? '',
});

// Normaliza datos del frontend para enviar al backend (crear)
export const buildCreatePayload = (data) => ({
  nombre: data.nombre,
  correo: data.email,
  contrasenia: data.password,
  rol_id: Number(data.rol),
  estado: true,
  telefono: data.telefono || '',
  fecha_nacimiento: data.fechaNacimiento,
  tipo_documento: data.tipoDocumento,
  numero_documento: data.numeroDocumento,
});

// Normaliza datos del frontend para enviar al backend (actualizar)
export const buildUpdatePayload = (data, includePassword = false) => {
  const payload = {
    nombre: data.nombre,
    correo: data.email,
    rol_id: Number(data.rol),
    telefono: data.telefono || '',
    fecha_nacimiento: data.fechaNacimiento,
    tipo_documento: data.tipoDocumento,
    numero_documento: data.numeroDocumento,
  };

  if (includePassword && data.password && data.password !== '') {
    payload.contrasenia = data.password;
  }

  return payload;
};

// Normaliza datos para cambiar estado
export const buildToggleEstadoPayload = (usuario, nuevoEstado) => ({
  nombre: usuario.nombre,
  correo: usuario.correo,
  rol_id: usuario.rol_id,
  estado: nuevoEstado === 'activo',
  telefono: usuario.telefono || '',
  fecha_nacimiento: usuario.fecha_nacimiento,
  tipo_documento: usuario.tipo_documento || '',
  numero_documento: usuario.numero_documento || '',
});

// Normaliza respuesta del backend a formato frontend
export const normalizeBackendToFrontend = (user) => ({
  id: user.id,
  nombre: user.nombre,
  email: user.correo,
  telefono: user.telefono || '',
  fechaNacimiento: user.fecha_nacimiento,
  tipoDocumento: user.tipo_documento || '',
  numeroDocumento: user.numero_documento || '',
  rol: user.rol_id,
  rol_id: user.rol_id,
  estado: normalizeUserEstado(user.estado),
  estadoBool: user.estado,
});