import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPedidoById, updatePedido } from "../../../../lib/data/pedidosData";
import PedidosForm from "../../components/pedidos/PedidosForm";

export default function EditarPedido() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const data = getPedidoById(Number(id));
    setPedido(data);
  }, [id]);

  const handleUpdate = (data) => {
    updatePedido(Number(id), data);
    navigate(-1);
  };

  if (!pedido) {
    return <div>Cargando...</div>;
  }

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