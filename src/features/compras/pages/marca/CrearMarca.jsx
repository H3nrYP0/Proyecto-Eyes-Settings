import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarcaForm from "./components/MarcasForm";
import { MarcaData } from "../../../../lib/data/marcasData";

export default function CrearMarca() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await MarcaData.createMarca(data);
      navigate("/admin/compras/marcas");
    } catch (error) {
      console.error("Error al crear marca:", error);
      alert("Error al crear la marca");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarcaForm
      mode="create"
      title="Crear Nueva Marca"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/compras/marcas")}
    />
  );
}