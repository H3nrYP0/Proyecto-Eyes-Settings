import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../../shared/constants/roles";

export default function Login({ setUser }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Ingresa un nombre para continuar");

    const userData = { 
      name: name.trim(), 
      role,
      permissions: getPermissionsByRole(role) // ✅ Usa la función local
    };
    setUser(userData);
    navigate("/admin/dashboard");
  };

  // ✅ Función local para obtener permisos - NO usa PERMISSIONS importado
  const getPermissionsByRole = (role) => {
    const permissionsMap = {
      [ROLES.ADMIN]: ['*'], // Acceso total
      [ROLES.DEMO]: ['dashboard'], // Solo dashboard
      [ROLES.VENDEDOR]: ['dashboard', 'ventas', 'clientes'],
      [ROLES.OPTICO]: ['dashboard', 'servicios', 'agenda']
    };
    return permissionsMap[role] || ['dashboard'];
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Iniciar Sesión</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value={ROLES.ADMIN}>Administrador</option>
            <option value={ROLES.DEMO}>Usuario Demo</option>
            <option value={ROLES.VENDEDOR}>Vendedor</option>
            <option value={ROLES.OPTICO}>Óptico</option>
          </select>

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}