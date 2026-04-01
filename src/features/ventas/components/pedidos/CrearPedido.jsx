// ===== CrearPedido.jsx =====
// Sin cambios en la lógica — PedidosForm ya maneja todo con el backend
import { useNavigate } from "react-router-dom";
import PedidosForm from "../../components/pedidos/PedidosForm";

export default function CrearPedido() {
  const navigate = useNavigate();

  return (
    <PedidosForm
      mode="create"
      title="Crear Nuevo Pedido"
      onCancel={() => navigate(-1)}
    />
  );
}