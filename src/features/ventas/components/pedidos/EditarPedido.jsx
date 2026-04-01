import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PedidosData } from "../../../../lib/data/pedidosData";
import PedidosForm from "../../components/pedidos/PedidosForm";

export default function EditarPedido() {
  const navigate   = useNavigate();
  const { id }     = useParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    PedidosData.getPedidoById(Number(id))
      .then(setPedido)
      .catch((err) => {
        console.error("Error al cargar pedido:", err);
        navigate(-1);
      });
  }, [id]);

  const handleUpdate = () => {
    navigate(-1);
  };

  if (!pedido) return <div style={{ padding: 40, color: "#9ca3af" }}>Cargando…</div>;

  return (
    <PedidosForm
      mode="edit"
      title={`Editar Pedido #${pedido.id}`}
      initialData={pedido}
      onSubmit={handleUpdate}
      onCancel={() => navigate(-1)}
    />
  );
}