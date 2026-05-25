/**
 * Componente para rutas protegidas.
 * - Verifica autenticación.
 * - Opcionalmente verifica un permiso (string) o un array de permisos (cualquiera de ellos).
 * - Si no autenticado → redirige a /login.
 * - Si no tiene el/los permisos requeridos → redirige a /productos.
 */

import { Navigate, useLocation } from "react-router-dom";
import authServices from "@auth/services/authServices";

export default function ProtectedRoute({ children, permiso }) {
  const location = useLocation();
  const user = authServices.getUser();
  const isAuthenticated = authServices.isAuthenticated();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especifica algún permiso requerido
  if (permiso) {
    // Si permiso es un array, comprobar si el usuario tiene al menos uno
    if (Array.isArray(permiso)) {
      const hasAny = permiso.some(p => authServices.hasPermission(user, p));
      if (!hasAny) {
        console.warn(`Acceso denegado: falta alguno de los permisos requeridos: ${permiso.join(", ")}`);
        return <Navigate to="/productos" replace />;
      }
    } 
    // Si permiso es un string
    else {
      if (!authServices.hasPermission(user, permiso)) {
        console.warn(`Acceso denegado: falta permiso "${permiso}"`);
        return <Navigate to="/productos" replace />;
      }
    }
  }

  return children;
}