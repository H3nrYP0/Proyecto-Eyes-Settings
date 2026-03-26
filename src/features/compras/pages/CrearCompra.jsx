import { useNavigate } from "react-router-dom";
import ComprasForm from "../components/ComprasForm";

export default function CrearCompra() {
  const navigate = useNavigate();

  return (
    <ComprasForm
      mode="create"
      title="Crear Nueva Compra"
      onCancel={() => navigate("/admin/compras")}
    />
  );
}