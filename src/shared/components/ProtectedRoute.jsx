import { Navigate } from "react-router-dom";
import { ROLES } from "../constants/roles";

// ESTE COMPONENTE PROTEGE LAS RUTAS QUE REQUIEREN AUTENTICACIÓN
export default function ProtectedRoute({ user, allowedRoles, children }) {
  
  // ESTA VALIDACIÓN REDIRIGE AL LOGIN SI NO HAY USUARIO
  if (!user) return <Navigate to="/login" replace />;

  // ESTA VALIDACIÓN PERMITE ACCESO TOTAL AL ADMIN
  if (user.role === ROLES.ADMIN) {
    return children;
  }

  // ESTA VALIDACIÓN VERIFICA SI EL ROL DEL USUARIO ESTÁ PERMITIDO
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // SI PASA TODAS LAS VALIDACIONES, RENDERIZA EL CONTENIDO
  return children;
}