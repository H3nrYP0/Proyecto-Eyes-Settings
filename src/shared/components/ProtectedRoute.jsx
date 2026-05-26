/**
 * Componente para rutas protegidas.
 * - Verifica autenticación.
 * - Los clientes NO pueden acceder a rutas administrativas bajo /admin/*
 * - Opcionalmente verifica un permiso (string) o un array de permisos.
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

  // BLOQUEO EXPLÍCITO: Los clientes NO pueden acceder a NINGUNA ruta bajo /admin
  if (user.es_cliente === true && location.pathname.startsWith("/admin")) {
    console.warn("Acceso denegado: los clientes no pueden acceder al panel administrativo");
    return <Navigate to="/productos" replace />;
  }

  // Si se especifica algún permiso requerido
  if (permiso) {
    if (Array.isArray(permiso)) {
      const hasAny = permiso.some(p => authServices.hasPermission(user, p));
      if (!hasAny) {
        console.warn(`Acceso denegado: falta alguno de los permisos requeridos: ${permiso.join(", ")}`);
        return <Navigate to="/productos" replace />;
      }
    } else {
      if (!authServices.hasPermission(user, permiso)) {
        console.warn(`Acceso denegado: falta permiso "${permiso}"`);
        return <Navigate to="/productos" replace />;
      }
    }
  }

  return children;
}