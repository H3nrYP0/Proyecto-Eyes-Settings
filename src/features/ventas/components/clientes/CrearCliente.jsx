import { useNavigate } from "react-router-dom";
import ClientsForm from "./ClientsForm";
import { createCliente } from "../../../../lib/data/clientesData";

export default function CrearCliente() {
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    createCliente(data);
    navigate("/admin/ventas/clientes");
  };

  return (
    <ClientsForm
      title="Crear Cliente"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/ventas/clientes")}
    />
  );
}
