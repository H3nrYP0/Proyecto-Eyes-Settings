// Función para filtrar usuarios por nombre y estado
export const filtrarUsuarios = (usuarios, search, estado) => {
  // 1. Forzamos que sea un string. Si search es null/undefined, usamos ""
  const term = (search || "").toString().toLowerCase();

  return usuarios.filter((user) => {
    // 2. Usamos Optional Chaining (?.) por si user.nombre no existe
    const nombreUser = (user.nombre || "").toLowerCase();

    const matchEstado = !estado || user.estado === estado;

    return nombreUser.includes(term) && matchEstado;
  });
};