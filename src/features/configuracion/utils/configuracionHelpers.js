// features/configuracion/utils/configuracionHelpers.js

export const validarNombre = (nombre) => {
  if (!nombre || nombre.trim() === '') return 'El nombre es requerido';
  if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
  if (nombre.trim().length > 100) return 'El nombre no puede exceder 100 caracteres';
  return '';
};

export const validarTelefono = (telefono) => {
  if (telefono && !/^[+]?[\d\s-()]{7,20}$/.test(telefono)) {
    return 'Formato de teléfono inválido';
  }
  return '';
};

export const validarFechaNacimiento = (fecha) => {
  if (fecha) {
    const fechaObj = new Date(fecha);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaObj.getFullYear();
    if (edad < 18) return 'Debes ser mayor de 18 años';
    if (edad > 120) return 'Fecha inválida';
  }
  return '';
};

export const validarContrasena = (contrasena) => {
  if (!contrasena) return 'La contraseña es requerida';
  if (contrasena.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return '';
};