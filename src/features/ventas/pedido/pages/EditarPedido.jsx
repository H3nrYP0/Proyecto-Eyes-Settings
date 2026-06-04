import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { pedidosService } from "../services/pedidosService";
import PedidoForm from "../components/PedidoForm";
import Loading from "@shared/components/ui/Loading";

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

  if (!pedido) return <Loading text="Cargando pedido..." />;

  return (
    <PedidoForm
      mode="edit"
      title={`Editar Pedido #${id}`}
      initialData={pedido}
      onCancel={() => navigate(-1)}
      onSuccess={() => navigate("/admin/ventas/pedidos")}
    />
  );
}