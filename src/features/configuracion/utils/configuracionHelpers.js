// features/configuracion/utils/configuracionHelpers.js

export const validarNombre = (nombre) => {
  if (!nombre || nombre.trim() === '') return 'El nombre es requerido';
  if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
  if (nombre.trim().length > 25) return 'El nombre no puede exceder los 25 caracteres';
  return '';
};

export const validarTelefono = (telefono) => {
  if (telefono && !/^\d{7,15}$/.test(telefono.replace(/[\s-]/g, ''))) {
    return 'Formato de teléfono inválido (solo números, 7-15 dígitos)';
  }
  return '';
};

export const validarDireccion = (direccion) => {
  if (direccion && direccion.trim().length > 100) return 'La dirección no puede exceder los 100 caracteres';
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

// Validación general para el formulario (sin apellido)
export const validarFormulario = (formData) => {
  const errors = {};
  
  const nombreError = validarNombre(formData.nombre);
  if (nombreError) errors.nombre = nombreError;
  
  const telefonoError = validarTelefono(formData.telefono);
  if (telefonoError) errors.telefono = telefonoError;
  
  const direccionError = validarDireccion(formData.direccion);
  if (direccionError) errors.direccion = direccionError;
  
  return errors;
};