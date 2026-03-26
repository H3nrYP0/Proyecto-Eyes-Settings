import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompraById } from "../../../lib/data/comprasData";
import ComprasForm from "../components/ComprasForm";

export default function DetalleCompra() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const data = getCompraById(Number(id));
    setCompra(data);
  }, [id]);

  if (!compra) {
    return <div>Cargando...</div>;
  }

  return (
    <ComprasForm
      mode="view"
      title={`Detalle de la Compra #${compra.id}`}
      initialData={compra}
      onCancel={() => navigate("/admin/compras")}
      onEdit={() => navigate(`/admin/compras/editar/${compra.id}`)}
      onPdf={() => navigate(`/admin/compras/detalle/${compra.id}/pdf`)} // ✅ corregido
    />
  );
}