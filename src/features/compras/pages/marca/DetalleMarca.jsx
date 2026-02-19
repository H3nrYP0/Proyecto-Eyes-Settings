import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MarcaForm from "./components/MarcasForm";
import { MarcaData } from "../../../../lib/data/marcasData";

export default function DetalleMarca() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [marca, setMarca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMarca();
  }, [id]);

  const loadMarca = async () => {
    try {
      setLoading(true);
      const data = await MarcaData.getMarcaById(parseInt(id));
      setMarca(data);
    } catch (err) {
      console.error("Error al cargar marca:", err);
      setError("No se pudo cargar la marca");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/compras/marcas/editar/${id}`);
  };

  if (loading && !marca) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!marca) {
    return <div>Marca no encontrada</div>;
  }

  return (
    <MarcaForm
      mode="view"
      title={`Detalle de Marca: ${marca.nombre}`}
      initialData={marca}
      onCancel={() => navigate("/admin/compras/marcas")}
      onEdit={handleEdit}
    />
  );
}