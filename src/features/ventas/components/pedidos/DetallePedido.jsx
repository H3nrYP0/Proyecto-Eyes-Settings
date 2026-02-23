import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPedidoById } from "../../../../lib/data/pedidosData";
import PedidosForm from "../../components/pedidos/PedidosForm";

export default function DetallePedido() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const data = getPedidoById(Number(id));
    setPedido(data);
  }, [id]);

  if (!pedido) {
    return <div>Cargando...</div>;
  }

  return (
    <PedidosForm
      mode="view"
      title={`Detalle del Pedido #${pedido.id}`}
      initialData={pedido}
      onCancel={() => navigate(-1)}
    />
  );
}