import authServices from '@auth/services/authServices';

export const useAuth = () => {
  const user = authServices.getUser();

  // ============================================================
  // TIPOS DE USUARIO 
  // ============================================================
  
  // Cliente registrado desde landing
  const isCliente = () => {
    return user?.es_cliente === true;
  };

  // Empleado administrativo (tiene rol)
  const isEmpleado = () => {
    return user?.es_cliente === false && user?.rol !== null;
  };

  // Admin (rol específico)
  const isAdmin = () => {
    return user?.rol === 'admin' || user?.rol === 'Admin';
  };

  // ============================================================
  // PERMISOS 
  // ============================================================

  const hasPermiso = (permiso) =>
    authServices.hasPermission(user, permiso);

  const hasRol = (rol) =>
    authServices.hasRole(user, rol);

  // Permisos CRUD para un módulo
  const hasPermisoCRUD = (modulo) => {
    if (isAdmin()) {
      return { 
        crear: true, 
        leer: true, 
        actualizar: true, 
        eliminar: true 
      };
    }
    
    if (!user?.permisos || !Array.isArray(user.permisos)) {
      return { 
        crear: false, 
        leer: false, 
        actualizar: false, 
        eliminar: false 
      };
    }
    
    const permisoModulo = user.permisos.find(p => p.modulo === modulo);
    
    if (!permisoModulo) {
      return { 
        crear: false, 
        leer: false, 
        actualizar: false, 
        eliminar: false 
      };
    }
    
    return {
      crear: permisoModulo.crear || false,
      leer: permisoModulo.leer || false,
      actualizar: permisoModulo.actualizar || false,
      eliminar: permisoModulo.eliminar || false
    };
  };

  const can = (modulo, accion) => {
    const permisos = hasPermisoCRUD(modulo);
    return permisos[accion] || false;
  };

  // ============================================================
  // RETORNAR
  // ============================================================

  return {
    user,
    isAdmin,
    isCliente,      
    isEmpleado,     
    hasPermiso,
    hasRol,
    hasPermisoCRUD,
    can
  };
};