// Convierte estado booleano a string para la UI
export const normalizeUserEstado = (estado) =>
  estado ? 'activo' : 'inactivo';

// Normaliza un usuario de la lista
export const normalizeUser = (u) => ({
  ...u,
  estado:             normalizeUserEstado(u.estado),
  estadosDisponibles: ['activo', 'inactivo'],
});

// Normaliza un array de usuarios
export const normalizeUsers = (arr) => arr.map(normalizeUser);

// Normaliza el initialData para el formulario
export const normalizeUserInitialData = (data) => ({
  nombre:          data.nombre          ?? '',
  email:           data.correo          ?? '',
  telefono:        data.telefono        ?? '',
  fechaNacimiento: data.fechaNacimiento ?? '',
  tipoDocumento:   data.tipoDocumento   ?? '',
  numeroDocumento: data.numeroDocumento ?? '',
  password:        '',
  confirmPassword: '',
  rol:             data.rol_id          ?? '',
});

// Arma el payload para crear un usuario
export const buildCreatePayload = (data) => ({
  nombre:      data.nombre,
  correo:      data.email,
  contrasenia: data.password,
  rol_id:      Number(data.rol),
  estado:      true,
});

// Arma el payload para actualizar un usuario
export const buildUpdatePayload = (data) => ({
  nombre:      data.nombre,
  correo:      data.email,
  contrasenia: data.password,
  rol_id:      Number(data.rol),
});

// Arma el payload para cambiar estado
export const buildToggleEstadoPayload = (usuario, nuevoEstado) => ({
  nombre:      usuario.nombre,
  correo:      usuario.correo,
  contrasenia: usuario.contrasenia,
  rol_id:      usuario.rol_id,
  estado:      nuevoEstado === 'activo',
});