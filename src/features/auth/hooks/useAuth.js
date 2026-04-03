import authServices from '../services/authServices';

export const useAuth = () => {
  const user = authServices.getUser();

  const isAdmin = () =>
    user?.rol === 'admin' || user?.rol === 'superadmin';

  const hasPermiso = (permiso) =>
    authServices.hasPermission(user, permiso);

  const hasRol = (rol) =>
    authServices.hasRole(user, rol);

  return {
    user,
    isAdmin,
    hasPermiso,
    hasRol,
  };
};