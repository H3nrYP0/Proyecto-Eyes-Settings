import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ComprasData } from "../../../lib/data/comprasData";
import ComprasForm from "../components/ComprasForm";

export default function DetalleCompra() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [compra,   setCompra]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    ComprasData.getCompraById(Number(id))
      .then(setCompra)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)  return <div style={{ padding: 40, textAlign: "center" }}>Cargando…</div>;
  if (notFound) return <div style={{ padding: 40, textAlign: "center" }}>Compra no encontrada.</div>;

  return (
    <ComprasForm
      mode="view"
      title={`Detalle de la Compra ${compra.numeroCompra}`}
      initialData={compra}
      onCancel={() => navigate("/admin/compras")}
      onEdit={() => navigate(`/admin/compras/editar/${compra.id}`)}
      onPdf={() => navigate(`/admin/compras/detalle/${compra.id}/pdf`)}
    />
  );
}