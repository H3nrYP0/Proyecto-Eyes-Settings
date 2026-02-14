import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoriaForm from "./components/categoriasForm";

import {
  getCategoriaById,
  updateCategoria,
} from "../../../../lib/data/categoriasData";

export default function EditarCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // Cargar categoría (API)
  // ============================
  useEffect(() => {
    const cargarCategoria = async () => {
      const categoriaData = await getCategoriaById(Number(id));

      if (!categoriaData) {
        navigate("/admin/compras/categorias");
        return;
      }

      setCategoria(categoriaData);
      setLoading(false);
    };

    cargarCategoria();
  }, [id, navigate]);

  // ============================
  // Guardar cambios
  // ============================
  const handleUpdate = async (data) => {
    const categoriaActualizada = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      // Si tu backend no maneja estado aún, puedes omitir esto
      estado: data.estado ?? categoria.estado,
    };

    await updateCategoria(Number(id), categoriaActualizada);
    navigate("/admin/compras/categorias");
  };

  if (loading) return null;

  return (
    <CategoriaForm
      mode="edit"
      title="Editar Categoría"
      initialData={categoria}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/admin/compras/categorias")}
    />
  );
}
