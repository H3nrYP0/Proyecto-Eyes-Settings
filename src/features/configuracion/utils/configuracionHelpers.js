// features/configuracion/utils/configuracionHelpers.js

export const validarNombre = (nombre) => {
  if (!nombre || nombre.trim() === '') return 'El nombre es requerido';
  if (nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
  if (nombre.trim().length > 30) return 'El nombre no puede exceder 30 caracteres';
  return '';
};

export const validarApellido = (apellido) => {
  if (!apellido || apellido.trim() === '') return 'El apellido es requerido';
  if (apellido.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres';
  if (apellido.trim().length > 30) return 'El apellido no puede exceder 30 caracteres';
  return '';
};

export const validarTelefono = (telefono) => {
  if (telefono && !/^\d{7,15}$/.test(telefono.replace(/[\s-]/g, ''))) {
    return 'Formato inválido (solo números, 7-15 dígitos)';
  }
  return '';
};

export const validarCiudad = (ciudad) => {
  if (ciudad && ciudad.trim().length > 50) return 'La ciudad no puede exceder 50 caracteres';
  return '';
};

export const validarDepartamento = (departamento) => {
  if (departamento && departamento.trim().length > 50) return 'El departamento no puede exceder 50 caracteres';
  return '';
};

export const validarDireccionPrincipal = (dir) => {
  if (dir && dir.trim().length > 100) return 'La dirección no puede exceder 100 caracteres';
  return '';
};

export const validarAptoTorre = (apto) => {
  if (apto && apto.trim().length > 20) return 'El apto/torre no puede exceder 20 caracteres';
  return '';
};

export const validarBarrio = (barrio) => {
  if (barrio && barrio.trim().length > 50) return 'El barrio no puede exceder 50 caracteres';
  return '';
};

export const validarNombreReceptor = (nombre) => {
  if (nombre && nombre.trim().length > 60) return 'El nombre del receptor no puede exceder 60 caracteres';
  return '';
};

export const validarIndicaciones = (ind) => {
  if (ind && ind.trim().length > 200) return 'Las indicaciones no pueden exceder 200 caracteres';
  return '';
};

export const validarFormulario = (formData) => {
  const errors = {};
  
  const nombreErr = validarNombre(formData.nombre);
  if (nombreErr) errors.nombre = nombreErr;
  
  const apellidoErr = validarApellido(formData.apellido);
  if (apellidoErr) errors.apellido = apellidoErr;
  
  const telefonoErr = validarTelefono(formData.telefono);
  if (telefonoErr) errors.telefono = telefonoErr;
  
  // Campos opcionales, solo validamos longitud
  const ciudadErr = validarCiudad(formData.ciudad);
  if (ciudadErr) errors.ciudad = ciudadErr;
  
  const deptoErr = validarDepartamento(formData.departamento);
  if (deptoErr) errors.departamento = deptoErr;
  
  const dirErr = validarDireccionPrincipal(formData.direccion_principal);
  if (dirErr) errors.direccion_principal = dirErr;
  
  const aptoErr = validarAptoTorre(formData.apto_torre);
  if (aptoErr) errors.apto_torre = aptoErr;
  
  const barrioErr = validarBarrio(formData.barrio);
  if (barrioErr) errors.barrio = barrioErr;
  
  const receptorErr = validarNombreReceptor(formData.nombre_receptor);
  if (receptorErr) errors.nombre_receptor = receptorErr;
  
  const indicErr = validarIndicaciones(formData.indicaciones);
  if (indicErr) errors.indicaciones = indicErr;
  
  return errors;
};