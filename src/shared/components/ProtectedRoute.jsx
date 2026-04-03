import { Navigate, useLocation } from "react-router-dom";
import authServices from "../../features/auth/services/authServices";

export default function ProtectedRoute({ children, permiso }) {
  const location = useLocation();
  const user = authServices.getUser();
  const isAuthenticated = authServices.isAuthenticated();

  // No autenticado → al login guardando la ruta de origen
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Autenticado pero sin el permiso requerido → a productos
  if (permiso && !authServices.hasPermission(user, permiso)) {
    console.warn(`Acceso denegado: no tiene permiso "${permiso}"`);
    return <Navigate to="/productos" replace />; 
  }

  return children;
}