import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ClientsForm from "./ClientsForm";
import { getClienteById, updateCliente } from "../../../../lib/data/clientesData";

export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const data = await getClienteById(Number(id));
        console.log("Cliente cargado para edición:", data);
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

  const handleSubmit = async (data) => {
    try {
      await updateCliente(Number(id), data);
      navigate("/admin/ventas/clientes");
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      alert("Error al actualizar el cliente. Por favor intente de nuevo.");
    }
  };

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
      mode="edit"
      title={`Editar Cliente: ${cliente.nombre} ${cliente.apellido}`}
      initialData={cliente}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/ventas/clientes")}
    />
  );
}