// Normaliza usuario del backend para el formulario
export const normalizeUserInitialData = (data) => ({
  id: data.id,
  correo: data.correo ?? '',
  rol_id: data.rol_id ?? '',
  empleado_id: data.empleado_id ?? '',
  empleado_nombre: data.empleado?.nombre ?? '',
  empleado_apellido: data.empleado?.apellido ?? '',
  empleado_documento: data.empleado?.numero_documento ?? '',
  estado: data.estado ?? true,
  contrasenia: '',
  confirmar_contrasenia: '',
});

// Normaliza datos para crear usuario admin
export const buildCreatePayload = (data) => ({
  correo: data.correo,
  contrasenia: data.contrasenia,
  rol_id: Number(data.rol_id),
  empleado_id: Number(data.empleado_id),
  estado: true,
});

// Normaliza datos para actualizar usuario admin
export const buildUpdatePayload = (data) => {
  const payload = {
    correo: data.correo,
    rol_id: Number(data.rol_id),
    estado: data.estado,
  };

  if (data.contrasenia && data.contrasenia !== '') {
    payload.contrasenia = data.contrasenia;
  }

  return payload;
};