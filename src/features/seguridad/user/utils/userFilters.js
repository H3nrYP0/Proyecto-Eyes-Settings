// Filtra usuarios por búsqueda de texto y estado
export const filterUsers = (usuarios, { search = '', estado = '' }) =>
  usuarios.filter((user) => {
    const matchSearch =
      user.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      user.correo?.toLowerCase().includes(search.toLowerCase());

    const matchEstado = !estado || user.estado === estado;

    return matchSearch && matchEstado;
  });