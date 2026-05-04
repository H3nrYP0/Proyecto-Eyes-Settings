const EMAIL_REGEX    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^.{6,}$/;

const DOC_VALIDATIONS = {
  CC:        /^\d{8,10}$/,
  CE:        /^\d{6,12}$/,
  PASAPORTE: /^[A-Z0-9]{6,12}$/,
  PEP:       /^[A-Z0-9]{6,15}$/,
};

const DOC_ERRORS = {
  CC:        'La cédula debe tener entre 8 y 10 dígitos',
  CE:        'La cédula de extranjería debe tener entre 6 y 12 dígitos',
  PASAPORTE: 'El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos',
  PEP:       'El PEP debe tener entre 6 y 15 caracteres alfanuméricos',
};

// Calcula la edad a partir de una fecha de nacimiento
export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  const hoy   = new Date();
  const birth = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - birth.getFullYear();
  const diff = hoy.getMonth() - birth.getMonth();
  if (diff < 0 || (diff === 0 && hoy.getDate() < birth.getDate())) edad--;
  return edad;
};

// ============================================================
// VALIDACIÓN DE LOGIN
// ============================================================
export const validateLoginForm = (correo, contrasenia) => {
  if (!correo?.trim() || !contrasenia?.trim())
    return 'Ingresa correo y contraseña para continuar';
  if (!EMAIL_REGEX.test(correo))
    return 'Ingresa un correo electrónico válido';
  if (contrasenia.length < 6)
    return 'La contraseña debe tener al menos 6 caracteres';
  return null;
};

// ============================================================
// VALIDACIÓN DE REGISTRO
// ============================================================
export const validateRegisterForm = (formData) => {
  const errors = {};

  // Nombre
  if (!formData.nombre?.trim())
    errors.nombre = 'El nombre es requerido';

  // Apellido
  if (!formData.apellido?.trim())
    errors.apellido = 'El apellido es requerido';

  // Correo
  if (!formData.correo?.trim())
    errors.correo = 'El correo electrónico es requerido';
  else if (!EMAIL_REGEX.test(formData.correo))
    errors.correo = 'Ingresa un correo electrónico válido';

  // Fecha de nacimiento
  if (!formData.fechaNacimiento)
    errors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
  else if (calcularEdad(formData.fechaNacimiento) < 18)
    errors.fechaNacimiento = 'Debes ser mayor de 18 años para registrarte';

  // Tipo documento
  if (!formData.tipoDocumento)
    errors.tipoDocumento = 'Selecciona un tipo de documento';

  // Número documento
  if (!formData.numeroDocumento?.trim()) {
    errors.numeroDocumento = 'El número de documento es requerido';
  } else if (
    formData.tipoDocumento &&
    DOC_VALIDATIONS[formData.tipoDocumento] &&
    !DOC_VALIDATIONS[formData.tipoDocumento].test(formData.numeroDocumento)
  ) {
    errors.numeroDocumento = DOC_ERRORS[formData.tipoDocumento];
  }

  // Contraseña
  if (!formData.contrasenia)
    errors.contrasenia = 'La contraseña es requerida';
  else if (formData.contrasenia.length < 6)
    errors.contrasenia = 'La contraseña debe tener al menos 6 caracteres';

  // Confirmar contraseña
  if (formData.contrasenia !== formData.confirmContrasenia)
    errors.confirmContrasenia = 'Las contraseñas no coinciden';

  // Términos
  if (!formData.agreeTerms)
    errors.agreeTerms = 'Debes aceptar los términos y condiciones';

  return errors;
};

// ============================================================
// VALIDACIÓN DE RECUPERACIÓN
// ============================================================
export const validateForgotEmail = (correo) => {
  if (!correo?.trim()) return 'Ingresa tu correo electrónico';
  if (!EMAIL_REGEX.test(correo)) return 'Ingresa un correo electrónico válido';
  return null;
};

export const validateOtpCode = (codigo) => {
  if (!codigo?.trim() || codigo.length !== 6) return 'Ingresa el código de 6 dígitos';
  return null;
};

export const validateResetPassword = (nuevaContrasenia, confirmarContrasenia) => {
  if (!nuevaContrasenia?.trim())
    return 'Ingresa tu nueva contraseña';
  if (nuevaContrasenia.length < 6)
    return 'La contraseña debe tener al menos 6 caracteres';
  if (nuevaContrasenia !== confirmarContrasenia)
    return 'Las contraseñas no coinciden';
  return null;
};