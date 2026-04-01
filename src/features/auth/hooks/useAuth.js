import authService from '../services/authService';

export const useAuth = () => {
  const user = authService.getUser();

  const isAdmin = () =>
    user?.rol === 'admin' || user?.rol === 'superadmin';

  const hasPermiso = (permiso) =>
    authService.hasPermission(user, permiso);

  const hasRol = (rol) =>
    authService.hasRole(user, rol);

  return {
    user,
    isAdmin,
    hasPermiso,
    hasRol,
  };
};