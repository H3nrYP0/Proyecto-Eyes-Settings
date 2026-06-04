import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { pedidosService } from "../services/pedidosService";
import PedidoForm from "../components/PedidoForm";
import Loading from "@shared/components/ui/Loading";

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

  if (!pedido) return <Loading text="Cargando pedido..." />;

  return (
    <PedidoForm
      mode="view"
      title={`Detalle del Pedido #${id}`}
      initialData={pedido}
      onCancel={() => navigate(-1)}
      onEdit={() => navigate(`/admin/ventas/pedidos/editar/${id}`)}
      onPdf={() => navigate(`/admin/ventas/pedidos/pdf/${id}`)}
    />
  );
}