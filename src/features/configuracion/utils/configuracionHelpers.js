/**
 * Utilidades de validación y normalización para el perfil unificado.
 * Incluye normalización de género (mayúscula inicial para UI, minúscula para backend)
 * y validaciones con límites según los modelos de BD.
 */

// ==================== NORMALIZADORES ====================
export const normalizeGender = (gender) => {
  if (!gender) return '';
  const lower = gender.toLowerCase();
  if (lower === 'masculino') return 'Masculino';
  if (lower === 'femenino') return 'Femenino';
  if (lower === 'otro') return 'Otro';
  return gender; // fallback
};

export const denormalizeGender = (gender) => {
  if (!gender) return '';
  if (gender === 'Masculino') return 'masculino';
  if (gender === 'Femenino') return 'femenino';
  if (gender === 'Otro') return 'otro';
  return gender.toLowerCase();
};

// ==================== VALIDACIONES POR CAMPO ====================
export const validarNombre = (nombre) => {
  if (!nombre || nombre.trim() === '') return 'El nombre es requerido';
  if (nombre.trim().length < 2) return 'Debe tener al menos 2 caracteres';
  if (nombre.trim().length > 70) return 'Máximo 70 caracteres';
  return '';
};

export const validarApellido = (apellido) => {
  if (!apellido || apellido.trim() === '') return 'El apellido es requerido';
  if (apellido.trim().length < 2) return 'Debe tener al menos 2 caracteres';
  if (apellido.trim().length > 70) return 'Máximo 70 caracteres';
  return '';
};

export const validarTelefono = (telefono) => {
  if (telefono && !/^\d{7,15}$/.test(telefono.replace(/[\s-]/g, ''))) {
    return 'Formato inválido (solo números, 7-15 dígitos)';
  }
  if (telefono && telefono.length > 10) return 'Máximo 10 caracteres';
  return '';
};

export const validarNumeroDocumento = (numero) => {
  // Solo números, longitud máxima 20
  if (numero && !/^\d+$/.test(numero)) return 'Solo números';
  if (numero && numero.length > 20) return 'Máximo 20 caracteres';
  return '';
};

export const validarFechaNacimiento = (fecha) => {
  if (!fecha) return '';
  const fechaDate = new Date(fecha);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaDate.getFullYear();
  const m = hoy.getMonth() - fechaDate.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaDate.getDate())) edad--;
  if (edad < 18) return 'Debes ser mayor de 18 años';
  if (edad > 100) return 'Fecha inválida';
  return '';
};

export const validarMunicipio = (municipio) => {
  if (municipio && municipio.trim().length > 50) return 'Máximo 50 caracteres';
  if (municipio && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/.test(municipio)) return 'Solo letras, espacios y guiones';
  return '';
};

export const validarDepartamento = (departamento) => {
  if (departamento && departamento.trim().length > 50) return 'Máximo 50 caracteres';
  if (departamento && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/.test(departamento)) return 'Solo letras, espacios y guiones';
  return '';
};

export const validarDireccion = (direccion) => {
  if (direccion && direccion.trim().length > 100) return 'Máximo 100 caracteres';
  return '';
};

export const validarBarrio = (barrio) => {
  if (barrio && barrio.trim().length > 50) return 'Máximo 50 caracteres';
  if (barrio && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/.test(barrio)) return 'Solo letras, espacios y guiones';
  return '';
};

export const validarCodigoPostal = (codigo) => {
  if (codigo && !/^\d+$/.test(codigo)) return 'Solo números';
  if (codigo && codigo.length > 10) return 'Máximo 10 caracteres';
  return '';
};

export const validarOcupacion = (ocupacion) => {
  if (ocupacion && ocupacion.trim().length > 20) return 'Máximo 20 caracteres';
  if (ocupacion && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/.test(ocupacion)) return 'Solo letras, espacios y guiones';
  return '';
};

export const validarTelefonoEmergencia = (tel) => {
  if (tel && !/^\d{7,15}$/.test(tel.replace(/[\s-]/g, ''))) {
    return 'Formato inválido (solo números, 7-15 dígitos)';
  }
  if (tel && tel.length > 20) return 'Máximo 20 caracteres';
  return '';
};

// ==================== VALIDACIÓN COMPLETA ====================
export const validarFormulario = (formData) => {
  const errors = {};

  const nombreErr = validarNombre(formData.nombre);
  if (nombreErr) errors.nombre = nombreErr;

  const apellidoErr = validarApellido(formData.apellido);
  if (apellidoErr) errors.apellido = apellidoErr;

  const telefonoErr = validarTelefono(formData.telefono);
  if (telefonoErr) errors.telefono = telefonoErr;

  const docNumErr = validarNumeroDocumento(formData.numero_documento);
  if (docNumErr) errors.numero_documento = docNumErr;

  const fechaErr = validarFechaNacimiento(formData.fecha_nacimiento);
  if (fechaErr) errors.fecha_nacimiento = fechaErr;

  const municipioErr = validarMunicipio(formData.municipio);
  if (municipioErr) errors.municipio = municipioErr;

  const deptoErr = validarDepartamento(formData.departamento);
  if (deptoErr) errors.departamento = deptoErr;

  const direccionErr = validarDireccion(formData.direccion);
  if (direccionErr) errors.direccion = direccionErr;

  const barrioErr = validarBarrio(formData.barrio);
  if (barrioErr) errors.barrio = barrioErr;

  const codigoErr = validarCodigoPostal(formData.codigo_postal);
  if (codigoErr) errors.codigo_postal = codigoErr;

  const ocupacionErr = validarOcupacion(formData.ocupacion);
  if (ocupacionErr) errors.ocupacion = ocupacionErr;

  const telefonoEmergenciaErr = validarTelefonoEmergencia(formData.telefono_emergencia);
  if (telefonoEmergenciaErr) errors.telefono_emergencia = telefonoEmergenciaErr;

  return errors;
};

// ==================== VALIDACIÓN DE CONTRASEÑA ====================
export const validarPassword = (nueva, confirmar) => {
  if (!nueva || nueva.length < 6) return 'Mínimo 6 caracteres';
  if (!/[A-Z]/.test(nueva)) return 'Debe tener una mayúscula';
  if (!/[0-9]/.test(nueva)) return 'Debe tener un número';
  if (nueva !== confirmar) return 'Las contraseñas no coinciden';
  return null;
};