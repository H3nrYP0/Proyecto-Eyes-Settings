const EMAIL_REGEX    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

export const validateAdminUserForm = (data, mode = "create") => {
  const errors = {};

  // Nombre completo
  if (!data.nombre?.trim()) {
    errors.nombre = "El nombre es requerido";
  } else if (data.nombre.trim().length < 2) {
    errors.nombre = "El nombre debe tener al menos 2 caracteres";
  } else if (data.nombre.trim().length > 50) {
    errors.nombre = "El nombre no puede exceder 50 caracteres";
  }

  // Correo
  if (!data.correo?.trim()) {
    errors.correo = "El correo es requerido";
  } else if (!EMAIL_REGEX.test(data.correo.trim())) {
    errors.correo = "Formato de correo inválido";
  }

  // Rol
  if (!data.rol_id) {
    errors.rol_id = "El rol es requerido";
  }

  // Contraseña
  if (mode === "create") {
    if (!data.contrasenia) {
      errors.contrasenia = "La contraseña es requerida";
    } else if (!PASSWORD_REGEX.test(data.contrasenia)) {
      errors.contrasenia = "Mínimo 6 caracteres, 1 mayúscula y 1 número";
    }
    if (data.contrasenia !== data.confirmar_contrasenia) {
      errors.confirmar_contrasenia = "Las contraseñas no coinciden";
    }
  } else if (mode === "edit" && data.contrasenia) {
    if (!PASSWORD_REGEX.test(data.contrasenia)) {
      errors.contrasenia = "Mínimo 6 caracteres, 1 mayúscula y 1 número";
    }
    if (data.contrasenia !== data.confirmar_contrasenia) {
      errors.confirmar_contrasenia = "Las contraseñas no coinciden";
    }
  }

  return errors;
};