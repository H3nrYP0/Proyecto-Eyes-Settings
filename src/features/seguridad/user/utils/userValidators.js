const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

// Valida los campos del formulario de usuario
export const validateUserForm = (formData, mode) => {
  const errors = {};

  if (!formData.nombre?.trim())
    errors.nombre = 'El nombre completo es requerido';

  if (!formData.email?.trim())
    errors.email = 'El correo electrónico es requerido';
  else if (!EMAIL_REGEX.test(formData.email))
    errors.email = 'Formato de email inválido';

  if (!formData.fechaNacimiento)
    errors.fechaNacimiento = 'La fecha de nacimiento es requerida';

  if (!formData.tipoDocumento)
    errors.tipoDocumento = 'Debe seleccionar un tipo de documento';

  if (!formData.numeroDocumento?.trim())
    errors.numeroDocumento = 'El número de documento es requerido';

  // Validación de contraseña solo en create y edit
  if (mode !== 'view') {
    if (!formData.password)
      errors.password = 'La contraseña es requerida';
    else if (!PASSWORD_REGEX.test(formData.password))
      errors.password = 'Debe tener al menos 6 caracteres, 1 mayúscula y 1 número';

    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  if (!formData.rol)
    errors.rol = 'Debe seleccionar un rol';

  return errors;
};