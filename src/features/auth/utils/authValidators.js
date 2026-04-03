const EMAIL_REGEX    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

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

// Calcula la edad a partir de una fecha de nacimiento (string YYYY-MM-DD)
export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  const hoy   = new Date();
  const birth = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - birth.getFullYear();
  const diff = hoy.getMonth() - birth.getMonth();
  if (diff < 0 || (diff === 0 && hoy.getDate() < birth.getDate())) edad--;
  return edad;
};

// Valida el formulario de registro
export const validateRegisterForm = (formData) => {
  const errors = {};

  if (!formData.nombre?.trim())
    errors.nombre = 'El nombre completo es requerido';

  if (!formData.correo?.trim())
    errors.correo = 'El correo electrónico es requerido';
  else if (!EMAIL_REGEX.test(formData.correo))
    errors.correo = 'Ingresa un correo electrónico válido';

  if (!formData.fechaNacimiento)
    errors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
  else if (calcularEdad(formData.fechaNacimiento) < 18)
    errors.fechaNacimiento = 'Debes ser mayor de 18 años para registrarte';

  if (!formData.tipoDocumento)
    errors.tipoDocumento = 'Selecciona un tipo de documento';

  if (!formData.numeroDocumento?.trim()) {
    errors.numeroDocumento = 'El número de documento es requerido';
  } else if (
    formData.tipoDocumento &&
    DOC_VALIDATIONS[formData.tipoDocumento] &&
    !DOC_VALIDATIONS[formData.tipoDocumento].test(formData.numeroDocumento)
  ) {
    errors.numeroDocumento = DOC_ERRORS[formData.tipoDocumento];
  }

  if (!formData.contrasenia)
    errors.contrasenia = 'La contraseña es requerida';
  else if (!PASSWORD_REGEX.test(formData.contrasenia))
    errors.contrasenia = 'Debe tener al menos 6 caracteres, 1 mayúscula y 1 número';

  if (formData.contrasenia !== formData.confirmContrasenia)
    errors.confirmContrasenia = 'Las contraseñas no coinciden';

  if (!formData.agreeTerms)
    errors.agreeTerms = 'Debes aceptar los términos y condiciones';

  return errors;
};

// Valida el correo en el paso 1 de recuperación
export const validateForgotEmail = (correo) => {
  if (!correo?.trim()) return 'Ingresa tu correo electrónico';
  if (!EMAIL_REGEX.test(correo)) return 'Ingresa un correo electrónico válido';
  return null;
};

// Valida el código OTP de 6 dígitos
export const validateOtpCode = (codigo) => {
  if (!codigo?.trim() || codigo.length !== 6) return 'Ingresa el código de 6 dígitos';
  return null;
};

// Valida la nueva contraseña en el paso 3 de recuperación
export const validateResetPassword = (nuevaContrasenia, confirmarContrasenia) => {
  if (!nuevaContrasenia?.trim())
    return 'Ingresa tu nueva contraseña';
  if (nuevaContrasenia.length < 6)
    return 'La contraseña debe tener al menos 6 caracteres';
  if (nuevaContrasenia !== confirmarContrasenia)
    return 'Las contraseñas no coinciden';
  return null;
};

// Valida el formulario de login
export const validateLoginForm = (correo, contrasenia) => {
  if (!correo?.trim() || !contrasenia?.trim())
    return 'Ingresa correo y contraseña para continuar';
  if (!EMAIL_REGEX.test(correo))
    return 'Ingresa un correo electrónico válido';
  if (contrasenia.length < 6)
    return 'La contraseña debe tener al menos 6 caracteres';
  return null;
};