import { Navigate, useLocation } from "react-router-dom";
import authService from "../../features/auth/services/authService";

export default function ProtectedRoute({ children, permiso }) {
  const location = useLocation();
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  // No autenticado → al login guardando la ruta de origen
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Autenticado pero sin el permiso requerido → a productos
  if (permiso && !authService.hasPermission(user, permiso)) {
    console.warn(`Acceso denegado: no tiene permiso "${permiso}"`);
    return <Navigate to="/productos" replace />; 
  }

  return children;
}