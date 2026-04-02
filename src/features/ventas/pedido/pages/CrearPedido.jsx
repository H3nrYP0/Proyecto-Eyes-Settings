import { useNavigate } from "react-router-dom";
import PedidoForm from "../components/PedidoForm";

export default function CrearPedido() {
  const navigate = useNavigate();

  return (
    <PedidoForm
      mode="create"
      title="Crear Nuevo Pedido"
      onCancel={() => navigate(-1)}
      onSuccess={() => navigate(-1)}
    />
  );
}