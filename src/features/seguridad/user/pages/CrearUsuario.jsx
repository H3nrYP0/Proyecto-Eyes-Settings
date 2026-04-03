import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Ruta relativa corregida para componente local
import UsuarioForm from "../components/UserForm";
import Loading     from "@shared/components/ui/Loading";

// Servicios desde el barril
import { createUser, getAllRoles } from "@seguridad";

export default function CrearUsuario() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await getAllRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, []);

  const handleCreate = async (data) => {
    try {
      const payload = {
        nombre: data.nombre,
        correo: data.email,
        contrasenia: data.password,
        rol_id: Number(data.rol),
        estado: true,
      };
      await createUser(payload);
      navigate("/admin/seguridad/usuarios");
    } catch (error) {
      alert("Error al crear usuario");
    }
  };

  if (loading) return <Loading message="Cargando roles..." />;

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