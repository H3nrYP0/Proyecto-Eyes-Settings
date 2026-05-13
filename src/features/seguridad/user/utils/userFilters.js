// Filtra usuarios por nombre o correo, y por estado
export const filtrarUsuarios = (usuarios, search, estado) => {
  const term = (search || "").toString().toLowerCase().trim();

  return usuarios.filter((user) => {
    const nombre = (user.nombre || "").toLowerCase();
    const correo = (user.correo || "").toLowerCase();

    const matchSearch = !term || nombre.includes(term) || correo.includes(term);
    const matchEstado = !estado || user.estado === estado;

    return matchSearch && matchEstado;
  });
};