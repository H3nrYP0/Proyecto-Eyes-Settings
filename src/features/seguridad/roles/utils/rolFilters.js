// Filtra roles por búsqueda de texto y estado
export const filtrarRoles = (roles, { search = '', estado = '' }) =>
  roles.filter((rol) => {
    const matchSearch =
      rol.nombre.toLowerCase().includes(search.toLowerCase()) ||
      rol.descripcion?.toLowerCase().includes(search.toLowerCase());

    const matchEstado = !estado || rol.estado === estado;

    return matchSearch && matchEstado;
  });