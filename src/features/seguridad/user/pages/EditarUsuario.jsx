import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import UsuarioForm from "../components/UserForm";
import Loading     from "@shared/components/ui/Loading";

import { getUserById, updateUser, getAllRoles } from "@seguridad";

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [data, rolesData] = await Promise.all([
        getUserById(id),
        getAllRoles(),
      ]);
      setUsuario({ ...data, email: data.correo, rol: data.rol_id });
      setRoles(rolesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data) => {
    try {
      const payload = {
        nombre: data.nombre,
        correo: data.email,
        contrasenia: data.password,
        rol_id: Number(data.rol),
      };
      await updateUser(id, payload);
      navigate("/admin/seguridad/usuarios");
    } catch (error) {
      alert("Error al editar usuario");
    }
  };

  if (loading) return <Loading message="Cargando..." />;

  return (
    <UsuarioForm
      mode="edit"
      title={`Editar Usuario: ${usuario?.nombre}`}
      initialData={usuario}
      rolesDisponibles={roles}
      onSubmit={handleEdit}
      onCancel={() => navigate("/admin/seguridad/usuarios")}
    />
  );
}