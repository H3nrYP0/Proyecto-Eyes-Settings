// Tipos de documento disponibles para el registro
export const TIPOS_DOCUMENTO = {
  CC:        'Cédula de Ciudadanía',
  CE:        'Cédula de Extranjería',
  PASAPORTE: 'Pasaporte',
  PEP:       'Permiso Especial de Permanencia',
};

// Placeholder de ejemplo por tipo de documento
export const DOC_PLACEHOLDERS = {
  CC:        '12345678',
  CE:        '123456789012',
  PASAPORTE: 'AB123456',
  PEP:       'PEP2023001',
};

// Devuelve el estado inicial del formulario de registro
export const getRegisterInitialData = () => ({
  nombre:             '',
  correo:             '',
  telefono:           '',
  fechaNacimiento:    '',
  tipoDocumento:      'CC',
  numeroDocumento:    '',
  contrasenia:        '',
  confirmContrasenia: '',
  agreeTerms:         false,
});

// Arma el payload para enviar al endpoint de registro/reenvío
export const buildRegisterPayload = (formData) => ({
  nombre:          formData.nombre,
  correo:          formData.correo,
  contrasenia:     formData.contrasenia,
  numeroDocumento: formData.numeroDocumento,
  fechaNacimiento: formData.fechaNacimiento,
  tipoDocumento:   formData.tipoDocumento,
  telefono:        formData.telefono,
});

// Normaliza el error de login según el status y mensaje del backend
export const normalizeLoginError = (err) => {
  const status  = err.response?.status;
  const mensaje = err.response?.data?.error || err.message || '';

  if (mensaje.includes('inactiva')) return 'Tu cuenta está inactiva. Contacta al administrador.';
  if (status >= 500)               return 'Error del servidor. Intenta más tarde.';
  return 'Correo o contraseña incorrectos';
};

// Indica si el error de reset proviene de un código inválido
export const isInvalidCodeError = (err) => {
  const mensaje = err.response?.data?.error || '';
  return mensaje.includes('Código');
};