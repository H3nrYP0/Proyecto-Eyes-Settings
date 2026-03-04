import { Navigate, useLocation } from "react-router-dom";
import authService from "../../features/auth/Services/authService";

export default function ProtectedRoute({ children, permiso }) {
  const location = useLocation();
  const user = authService.getUser();

  // 🔐 No autenticado
  if (!authService.isAuthenticated() || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔎 Si se requiere permiso específico
  if (permiso && !authService.hasPermission(user, permiso)) {
    console.warn(`Acceso denegado: no tiene permiso "${permiso}"`);
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}