// ============================================
// VALIDADORES DE USUARIO
// ============================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

// Validar email
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, error: "El correo electrónico es requerido" };
  }
  if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
    return { valid: false, error: "Formato de correo inválido" };
  }
  return { valid: true };
};

// Validar contraseña
// required=true  → campo obligatorio (crear usuario)
// required=false → solo se valida si se proporcionó algo (editar usuario)
export const validatePassword = (password, required = false) => {
  if (!password || password === '') {
    if (required) {
      return { valid: false, error: "La contraseña es requerida" };
    }
    return { valid: true, isEmpty: true };
  }
  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      error: "La contraseña debe tener al menos 6 caracteres, 1 mayúscula y 1 número"
    };
  }
  return { valid: true, isEmpty: false };
};

// Validar nombre
export const validateNombre = (nombre) => {
  if (!nombre || !nombre.trim()) {
    return { valid: false, error: "El nombre es requerido" };
  }
  if (nombre.trim().length < 2) {
    return { valid: false, error: "El nombre debe tener al menos 2 caracteres" };
  }
  if (nombre.trim().length > 50) {
    return { valid: false, error: "El nombre no puede exceder 50 caracteres" };
  }
  return { valid: true };
};

// Validar rol
export const validateRolId = (rolId) => {
  if (!rolId && rolId !== 0) {
    return { valid: false, error: "El rol es requerido" };
  }
  if (isNaN(Number(rolId))) {
    return { valid: false, error: "El rol debe ser un número válido" };
  }
  return { valid: true };
};

// Validar teléfono (opcional)
export const validateTelefono = (telefono) => {
  if (telefono && telefono.length > 0) {
    if (!/^\d+$/.test(telefono)) {
      return { valid: false, error: "El teléfono debe contener solo números" };
    }
    if (telefono.length < 7 || telefono.length > 15) {
      return { valid: false, error: "El teléfono debe tener entre 7 y 15 dígitos" };
    }
  }
  return { valid: true };
};

// Validar fecha de nacimiento
export const validateFechaNacimiento = (fecha) => {
  if (!fecha) {
    return { valid: false, error: "La fecha de nacimiento es requerida" };
  }
  const fechaDate = new Date(fecha);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaDate.getFullYear();
  const mesDiff = hoy.getMonth() - fechaDate.getMonth();

  if (edad < 18 || (edad === 18 && mesDiff < 0)) {
    return { valid: false, error: "Debes ser mayor de 18 años" };
  }
  if (edad > 120) {
    return { valid: false, error: "Fecha de nacimiento inválida" };
  }
  return { valid: true };
};

// Validar tipo de documento
export const validateTipoDocumento = (tipoDocumento) => {
  const tiposValidos = ['cedula', 'cedula_extranjera', 'pasaporte', 'ppt'];
  if (!tipoDocumento) {
    return { valid: false, error: "Debe seleccionar un tipo de documento" };
  }
  if (!tiposValidos.includes(tipoDocumento)) {
    return { valid: false, error: "Tipo de documento inválido" };
  }
  return { valid: true };
};

// Validar número de documento
export const validateNumeroDocumento = (numeroDocumento) => {
  if (!numeroDocumento || !numeroDocumento.trim()) {
    return { valid: false, error: "El número de documento es requerido" };
  }
  if (!/^\d+$/.test(numeroDocumento)) {
    return { valid: false, error: "El número de documento debe contener solo números" };
  }
  if (numeroDocumento.length < 5 || numeroDocumento.length > 20) {
    return { valid: false, error: "El número de documento debe tener entre 5 y 20 dígitos" };
  }
  return { valid: true };
};

// Validar todo el formulario completo
export const validateUserForm = (formData, mode = 'create') => {
  const errors = {};

  const nombreValid = validateNombre(formData.nombre);
  if (!nombreValid.valid) errors.nombre = nombreValid.error;

  const emailValid = validateEmail(formData.email);
  if (!emailValid.valid) errors.email = emailValid.error;

  const fechaValid = validateFechaNacimiento(formData.fechaNacimiento);
  if (!fechaValid.valid) errors.fechaNacimiento = fechaValid.error;

  const tipoDocValid = validateTipoDocumento(formData.tipoDocumento);
  if (!tipoDocValid.valid) errors.tipoDocumento = tipoDocValid.error;

  const numeroDocValid = validateNumeroDocumento(formData.numeroDocumento);
  if (!numeroDocValid.valid) errors.numeroDocumento = numeroDocValid.error;

  const telefonoValid = validateTelefono(formData.telefono);
  if (!telefonoValid.valid) errors.telefono = telefonoValid.error;

  if (mode !== 'view') {
    // En 'create' la contraseña es obligatoria; en 'edit' solo se valida si se escribió algo
    const passwordRequired = mode === 'create';
    const passwordValid = validatePassword(formData.password, passwordRequired);
    if (!passwordValid.valid) errors.password = passwordValid.error;

    // Solo validar confirmación si se ingresó algo (o es create)
    if (passwordRequired || formData.password) {
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden";
      }
    }
  }

  const rolValid = validateRolId(formData.rol);
  if (!rolValid.valid) errors.rol = rolValid.error;

  return errors;
};