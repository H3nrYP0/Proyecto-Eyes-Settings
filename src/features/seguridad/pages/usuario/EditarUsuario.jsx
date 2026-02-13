import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsuarioForm from "./components/UserForm";

import {
  getUsuarioById,
  updateUsuario
} from "../../../../lib/data/usuariosData";

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // Cargar usuario
  // ============================

  useEffect(() => {
    const cargarUsuario = () => {
      const usuarioData = getUsuarioById(Number(id));
      
      if (!usuarioData) {
        navigate("/admin/seguridad/usuarios");
        return;
      }

      setUsuario(usuarioData);
      setLoading(false);
    };

    cargarUsuario();
  }, [id, navigate]);

  // ============================
  // Guardar cambios
  // ============================

  const handleUpdate = (data) => {
    // Crear objeto con los datos a actualizar
    const usuarioActualizado = {
      id: Number(id),
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      fechaNacimiento: data.fechaNacimiento,
      tipoDocumento: data.tipoDocumento,
      numeroDocumento: data.numeroDocumento,
      rol: data.rol,
      // Mantener estado y fechaRegistro del usuario original
      estado: usuario.estado,
      fechaRegistro: usuario.fechaRegistro
    };

    // Solo incluir password si se proporcionó una nueva
    if (data.password) {
      usuarioActualizado.password = data.password;
    }

    updateUsuario(Number(id), usuarioActualizado);
    navigate("/admin/seguridad/usuarios");
  };

  if (loading) return null;

  return (
    <UsuarioForm
      mode="edit"
      title="Editar Usuario"
      initialData={usuario}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/admin/seguridad/usuarios")}
    />
  );
}