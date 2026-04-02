import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { clientesService } from "../services/clientesService";
import ClienteForm from "../components/ClienteForm";

export default function DetalleCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientesService.getClienteById(Number(id))
      .then(data => {
        setCliente(data);
        setLoading(false);
      })
      .catch(() => {
        navigate("/admin/ventas/clientes");
      });
  }, [id, navigate]);

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando cliente...</div>;
  if (!cliente) return null;

  return (
    <ClienteForm
      mode="view"
      title={`Detalle Cliente: ${cliente.nombre} ${cliente.apellido}`}
      initialData={cliente}
      onCancel={() => navigate("/admin/ventas/clientes")}
      onEdit={() => navigate(`/admin/ventas/clientes/editar/${id}`)}
    />
  );
}