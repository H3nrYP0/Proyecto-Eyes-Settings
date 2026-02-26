import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UsuarioForm from "./components/UserForm";
import Loading from "../../../../shared/components/ui/Loading";

import { UserData } from "../../../../lib/data/usuariosData";
import { getAllRoles } from "../../../../lib/data/rolesData";

export default function CrearUsuario() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const rolesData = await getAllRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error(error);
      alert("Error al cargar roles");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      const payload = {
        nombre: data.nombre,
        correo: data.email,
        contrasenia: data.password,
        rol_id: Number(data.rol),
        estado: true,
      };

      console.log("PAYLOAD FINAL:", payload);

      await UserData.createUser(payload);

      navigate("/admin/seguridad/usuarios");
    } catch (error) {
      console.log("MENSAJE BACKEND:", error.response?.data);
      alert("Error al crear usuario");
    }
  };

  if (loading) {
    return <Loading message="Cargando roles..." />;
  }

  return (
    <UsuarioForm
      mode="create"
      title="Crear Nuevo Usuario"
      rolesDisponibles={roles}
      onSubmit={handleCreate}
      onCancel={() => navigate("/admin/seguridad/usuarios")}
      
    />
  );
}