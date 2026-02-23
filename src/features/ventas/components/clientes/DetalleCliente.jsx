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
        const data = await getClienteById(Number(id));
        console.log("Cliente cargado en detalle:", data);
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
    return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando cliente...</div>;
  }

  if (!cliente) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Cliente no encontrado</p>
        <button 
          className="crud-btn crud-btn-secondary" 
          onClick={() => navigate("/admin/ventas/clientes")}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <ClientsForm
      mode="view"
      title={`Detalle Cliente: ${cliente.nombre} ${cliente.apellido}`}
      initialData={cliente}
      onCancel={() => navigate("/admin/ventas/clientes")}
      onEdit={() => navigate(`/admin/ventas/clientes/editar/${id}`)}
    />
  );
}