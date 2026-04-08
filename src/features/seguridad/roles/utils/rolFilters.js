export const filtrarRoles = (roles, { search = '', estado = '' } = {}) => {
  if (!Array.isArray(roles)) return [];

  const term = (search || '').toString().toLowerCase();

  return roles.filter((rol) => {
    const nombreRol   = (rol.nombre || '').toString().toLowerCase();
    const matchNombre = nombreRol.includes(term);
    const matchEstado = !estado || rol.estado === estado;

    return matchNombre && matchEstado;
  });
};