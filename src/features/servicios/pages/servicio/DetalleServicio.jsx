// src/features/servicios/pages/DetalleServicio.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServicioForm from "./components/ServicioForm";
import { getServicioById } from "../../../../lib/data/serviciosData";

export default function DetalleServicio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadServicio();
  }, [id]);

  const loadServicio = async () => {
    try {
      setLoading(true);
      const data = await getServicioById(parseInt(id));
      setServicio(data);
    } catch (err) {
      console.error("Error al cargar servicio:", err);
      setError("No se pudo cargar el servicio");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/servicios/editar/${id}`);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!servicio) return <div>Servicio no encontrado</div>;

  return (
    <ServicioForm
      mode="view"
      title={`Detalle de Servicio: ${servicio.nombre}`}
      initialData={servicio}
      onCancel={() => navigate("/admin/servicios")}
      onEdit={handleEdit}
    />
  );
}