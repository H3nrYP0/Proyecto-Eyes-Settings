// Función para filtrar roles por nombre
export const filtrarRoles = (roles, search) => {
  // Forzamos que term sea un string. Si search es undefined/null, usamos ""
  const term = (search || "").toString().toLowerCase();

  // Si roles no es un array (por si acaso), devolvemos un array vacío
  if (!Array.isArray(roles)) return [];

  return roles.filter((rol) => {
    // Validamos que rol.nombre exista antes de usar toLowerCase
    const nombreRol = (rol.nombre || "").toString().toLowerCase();
    
    return nombreRol.includes(term);
  });
};