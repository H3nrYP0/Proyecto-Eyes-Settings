import { useNavigate } from "react-router-dom";
import UsuarioForm from "./components/UserForm";
import { createUsuario } from "../../../../lib/data/usuariosData";

export default function CrearUsuario() {
  const navigate = useNavigate();

  // Lista de roles disponibles (puede venir del backend más adelante)
  const rolesDisponibles = [
    { value: "administrador", label: "Administrador" },
    { value: "vendedor", label: "Vendedor" },
    { value: "optometra", label: "Optómetra" },
    { value: "tecnico", label: "Técnico" }
  ];

  const handleCreate = (data) => {
    // Agregamos estado por defecto al usuario nuevo
    const usuarioConEstado = {
      ...data,
      estado: "activo"
    };

    createUsuario(usuarioConEstado);
    navigate("/admin/seguridad/usuarios");
  };

  return (
    <UsuarioForm
      mode="create"
      title="Crear Nuevo Usuario"
      rolesDisponibles={rolesDisponibles}
      onSubmit={handleCreate}
      onCancel={() => navigate("/admin/seguridad/usuarios")}
    />
  );
}
