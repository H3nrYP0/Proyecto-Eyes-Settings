import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ClientsForm from "./ClientsForm";
import { getClienteById } from "../../../../lib/data/clientesData";

export default function DetalleCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const res = await getClienteById(Number(id));
        const data = res?.data || res;
        setCliente(data);
      } catch (error) {
        console.error("Error cargando cliente:", error);
        setCliente(null);
      } finally {
        setLoading(false);
      }
    };

    cargarCliente();
  }, [id]);

  if (loading) {
    return <p>Cargando cliente...</p>;
  }

  if (!cliente) {
    return <p>Cliente no encontrado</p>;
  }

  return (
    <ClientsForm
      mode="view"
      title="Detalle Cliente"
      initialData={cliente}
      onCancel={() => navigate("/admin/ventas/clientes")}
      onEdit={() => navigate(`/admin/ventas/clientes/editar/${id}`)}
    />
  );
}