/**
 * Verifica si el usuario tiene un permiso específico
 * @param {Object} user - Objeto usuario del estado
 * @param {string} permiso - Nombre del permiso a verificar
 * @returns {boolean} - true si tiene el permiso, false en caso contrario
 */
export const hasPermiso = (user, permiso) => {
  if (!user) return false;
  
  // Estructura real de tu JWT: user.permisos es un array de strings
  if (user.permisos && Array.isArray(user.permisos)) {
    return user.permisos.includes(permiso);
  }
  
  // Por si en el futuro la estructura cambia a objetos
  if (user.permisos && Array.isArray(user.permisos) && user.permisos[0]?.nombre) {
    return user.permisos.some(p => p.nombre === permiso);
  }
  
  // Soporte para estructura con roles (por compatibilidad)
  if (user.roles && Array.isArray(user.roles)) {
    if (typeof user.roles[0] === 'string') {
      return user.permisos?.includes(permiso) || false;
    }
    
    return user.roles.some((rol) => {
      if (rol.permisos && Array.isArray(rol.permisos)) {
        if (typeof rol.permisos[0] === 'string') {
          return rol.permisos.includes(permiso);
        }
        return rol.permisos.some((p) => p.nombre === permiso || p.name === permiso);
      }
      return false;
    });
  }
  
  return false;
};

/**
 * Verifica si el usuario tiene todos los permisos especificados
 * @param {Object} user - Objeto usuario
 * @param {string[]} permisos - Array de permisos a verificar
 * @returns {boolean}
 */
export const tieneTodosPermisos = (user, permisos) => {
  if (!user) return false;
  return permisos.every(permiso => hasPermiso(user, permiso));
};

/**
 * Verifica si el usuario tiene al menos uno de los permisos especificados
 * @param {Object} user - Objeto usuario
 * @param {string[]} permisos - Array de permisos a verificar
 * @returns {boolean}
 */
export const tieneAlgunPermiso = (user, permisos) => {
  if (!user) return false;
  return permisos.some(permiso => hasPermiso(user, permiso));
};

/**
 * Verifica si el usuario tiene un rol específico
 * @param {Object} user - Objeto usuario
 * @param {string|string[]} roles - Rol o roles a verificar
 * @returns {boolean}
 */
export const tieneRol = (user, roles) => {
  if (!user) return false;
  
  const rolesArray = Array.isArray(roles) ? roles : [roles];
  
  if (user.roles && Array.isArray(user.roles)) {
    if (typeof user.roles[0] === 'string') {
      return user.roles.some(rol => rolesArray.includes(rol));
    }
    return user.roles.some(rol => 
      rolesArray.includes(rol.nombre) || rolesArray.includes(rol.name)
    );
  }
  
  return false;
};