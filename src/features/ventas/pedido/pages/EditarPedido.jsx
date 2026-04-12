import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { pedidosService } from "../services/pedidosService";
import PedidoForm from "../components/PedidoForm";

export default function EditarPedido() {
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
      mode="edit"
      title="Editar Pedido"
      initialData={pedido}
      onCancel={() => navigate(-1)}
      onSuccess={() => navigate(-1)}
    />
  );
}