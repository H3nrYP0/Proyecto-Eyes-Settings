import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { pedidosService } from "../services/pedidosService";
import PedidoForm from "../components/PedidoForm";

export default function DetallePedido() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    pedidosService.getPedidoById(Number(id))
      .then(setPedido)
      .catch((err) => {
        console.error("Error al cargar pedido:", err);
        navigate(-1);
      });
  }, [id, navigate]);

  if (!pedido) return <div style={{ padding: 40, color: "#9ca3af" }}>Cargando…</div>;

  return (
    <PedidoForm
      mode="view"
      title={`Detalle del Pedido #${pedido.id}`}
      initialData={pedido}
      onCancel={() => navigate(-1)}
    />
  );
}