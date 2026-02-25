// src/features/servicios/pages/EditarServicio.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServicioForm from "./components/ServicioForm";
import { getServicioById, updateServicio } from "../../../../lib/data/serviciosData";

export default function EditarServicio() {
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

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await updateServicio(parseInt(id), data);
      navigate("/admin/servicios");
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      alert("Error al actualizar el servicio");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!servicio) return <div>Servicio no encontrado</div>;

  return (
    <ServicioForm
      mode="edit"
      title={`Editar Servicio: ${servicio.nombre}`}
      initialData={servicio}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/servicios")}
    />
  );
}