// Verifica si todos los permisos están seleccionados
export const areAllSelected = (selected, available) =>
  available.length > 0 && selected.length === available.length;

// Agrega o quita un permiso de la selección
export const togglePermiso = (selected, permisoId) =>
  selected.includes(permisoId)
    ? selected.filter((id) => id !== permisoId)
    : [...selected, permisoId];

// Selecciona todos o limpia según el estado actual
export const toggleSelectAll = (selected, available) =>
  areAllSelected(selected, available)
    ? []
    : available.map((p) => p.id);