// src/features/servicios/pages/CrearServicio.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServicioForm from "./components/ServicioForm";
import { createServicio } from "../../../../lib/data/serviciosData";

export default function CrearServicio() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await createServicio(data);
      navigate("/admin/servicios");
    } catch (error) {
      console.error("Error al crear servicio:", error);
      alert("Error al crear el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServicioForm
      mode="create"
      title="Crear Nuevo Servicio"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/servicios")}
    />
  );
}