import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ventasService } from "../services/ventasService";
import VentaForm from "../components/VentaForm";

export default function DetalleVenta() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ventasService.getVentaById(Number(id))
      .then(data => {
        setVenta(data);
        setLoading(false);
      })
      .catch(() => {
        navigate(-1);
      });
  }, [id, navigate]);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Cargando...</div>;
  if (!venta) return null;

  return (
    <VentaForm
      mode="view"
      title={`Detalle de Venta #${venta.id}`}
      initialData={venta}
      onCancel={() => navigate(-1)}
      onSuccess={() => navigate(`editar/${venta.id}`)}
    />
  );
}