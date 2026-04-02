import { useNavigate } from "react-router-dom";
import ClienteForm from "../components/ClienteForm";

export default function CrearCliente() {
  const navigate = useNavigate();

  return (
    <ClienteForm
      mode="create"
      title="Crear Cliente"
      onSubmit={() => navigate("/admin/ventas/clientes")}
      onCancel={() => navigate("/admin/ventas/clientes")}
    />
  );
}