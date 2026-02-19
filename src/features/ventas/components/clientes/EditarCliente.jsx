import { useParams, useNavigate } from "react-router-dom";
import ClientsForm from "./ClientsForm";
import { getClienteById, updateCliente } from "../../../../lib/data/clientesData";

export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const cliente = getClienteById(Number(id));

  const handleSubmit = (data) => {
    updateCliente(Number(id), data);
    navigate("/admin/ventas/clientes");
  };

  return (
    <ClientsForm
      mode="edit"
      title="Editar Cliente"
      initialData={cliente}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/ventas/clientes")}
    />
  );
}