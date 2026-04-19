import authServices from '@auth/services/authServices';

export const useAuth = () => {
  const user = authServices.getUser();

  const isAdmin = () =>
    user?.rol === 'admin' || user?.rol === 'superadmin';

  const hasPermiso = (permiso) =>
    authServices.hasPermission(user, permiso);

  const hasRol = (rol) =>
    authServices.hasRole(user, rol);

  // ✅ NUEVA FUNCIÓN: Verificar permisos CRUD para un módulo
  const hasPermisoCRUD = (modulo) => {
    // Admin tiene todos los permisos
    if (isAdmin()) {
      return { 
        crear: true, 
        leer: true, 
        actualizar: true, 
        eliminar: true 
      };
    }
    
    // Si no hay usuario o no tiene permisos
    if (!user?.permisos || !Array.isArray(user.permisos)) {
      return { 
        crear: false, 
        leer: false, 
        actualizar: false, 
        eliminar: false 
      };
    }
    
    // Buscar el permiso del módulo específico
    const permisoModulo = user.permisos.find(p => p.modulo === modulo);
    
    if (!permisoModulo) {
      return { 
        crear: false, 
        leer: false, 
        actualizar: false, 
        eliminar: false 
      };
    }
    
    // Retornar los permisos CRUD del módulo
    return {
      crear: permisoModulo.crear || false,
      leer: permisoModulo.leer || false,
      actualizar: permisoModulo.actualizar || false,
      eliminar: permisoModulo.eliminar || false
    };
  };

  // ✅ FUNCIÓN AUXILIAR: Verificar si tiene un permiso específico de CRUD
  const can = (modulo, accion) => {
    const permisos = hasPermisoCRUD(modulo);
    return permisos[accion] || false;
  };

  return {
    user,
    isAdmin,
    hasPermiso,
    hasRol,
    hasPermisoCRUD,  // ← EXPORTAR NUEVA FUNCIÓN
    can              // ← EXPORTAR FUNCIÓN AUXILIAR
  };
};