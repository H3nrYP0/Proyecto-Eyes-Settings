import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategoriaById } from "../../../../lib/data/categoriasData";

import CategoriaForm from "./components/categoriasForm";

export default function DetalleCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCategoria = async () => {
      try {
        const data = await getCategoriaById(Number(id));

        if (!data) {
          navigate("/admin/compras/categorias");
          return;
        }

        // Normalizar estado: true/false -> "activa"/"inactiva"
        const normalizada = {
          ...data,
          estado: data.estado === true ? "activa" : "inactiva",
        };

        setCategoria(normalizada);
      } catch (error) {
        console.error("Error cargando categoría:", error);
        navigate("/admin/compras/categorias");
      } finally {
        setLoading(false);
      }
    };

    cargarCategoria();
  }, [id, navigate]);

  if (loading || !categoria) {
    return <div>Cargando...</div>;
  }

  return (
    <CategoriaForm
      mode="view"
      title={`Detalle de la Categoría: ${categoria.nombre}`}
      initialData={categoria}
      onCancel={() => navigate("/admin/compras/categorias")}
      onEdit={() =>
        navigate(`/admin/compras/categorias/editar/${categoria.id}`)
      }
    />
  );
}
