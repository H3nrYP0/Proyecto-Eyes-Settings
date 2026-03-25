import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompraById } from "../../../lib/data/comprasData";
import ComprasForm from "../components/ComprasForm";

export default function DetalleCompra() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [compra,  setCompra]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompraById(Number(id))
      .then((data) => {
        if (!data) {
          navigate("/admin/compras");
          return;
        }
        setCompra(data);
      })
      .catch(() => navigate("/admin/compras"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!compra)  return null;

  return (
    <ComprasForm
      mode="view"
      title={`Detalle de la Compra — ${compra.numeroCompra}`}
      initialData={compra}
      onCancel={() => navigate("/admin/compras")}
      onEdit={() => navigate(`/admin/compras/editar/${compra.id}`)}
      onPdf={()  => navigate(`/admin/compras/detalle/${compra.id}/pdf`)}
    />
  );
}