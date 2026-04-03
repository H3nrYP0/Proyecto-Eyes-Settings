// Valida el formulario de rol y retorna un objeto de errores
export const validarRolForm = ({ nombre, descripcion, permisos }) => {
  const errors = {};

  if (!nombre?.trim())
    errors.nombre = 'El nombre del rol es requerido';
  else if (nombre.length < 3)
    errors.nombre = 'El nombre debe tener al menos 3 caracteres';

  if (!descripcion?.trim())
    errors.descripcion = 'La descripción es requerida';

  if (!permisos?.length)
    errors.permisos = 'Debe seleccionar al menos un permiso';

  return errors;
};