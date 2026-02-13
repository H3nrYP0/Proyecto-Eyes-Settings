import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUsuarioById } from "../../../../lib/data/usuariosData";

import UsuarioForm from "./components/UserForm";

export default function DetalleUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = getUsuarioById(Number(id));
    setUsuario(data);
  }, [id]);

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <UsuarioForm
      mode="view"
      title={`Detalle del Usuario: ${usuario.nombre}`}
      initialData={usuario}
      onCancel={() => navigate("/admin/seguridad/usuarios")}
      onEdit={() =>
        navigate(`/admin/seguridad/usuarios/editar/${usuario.id}`)
      }
    />
  );
}