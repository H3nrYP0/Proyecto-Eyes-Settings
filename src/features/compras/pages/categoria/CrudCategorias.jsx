import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import CategoriasForm from "./CategoriasForm";

// Importamos mini-backend
import {
  getCategoriaById,
  createCategoria,
  updateCategoria,
} from "../../../../lib/data/categoriasData";

export default function CrudCategorias({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(mode !== "crear");
  const [categoriaData, setCategoriaData] = useState(null);

  // Cargar datos en editar/detalle
  useEffect(() => {
    if (mode === "crear") {
      setLoading(false);
      return;
    }

    const categoria = getCategoriaById(Number(id));

    if (!categoria) {
      alert("❌ Esta categoría no existe.");
      navigate("/admin/compras/categorias");
      return;
    }

    setCategoriaData(categoria);
    setLoading(false);
  }, [mode, id, navigate]);

  // Guardado
  const handleSubmit = (data) => {
    if (mode === "crear") {
      createCategoria(data);
      alert("✅ Categoría creada correctamente");
    } else {
      updateCategoria(Number(id), data);
      alert("✅ Cambios guardados correctamente");
    }

    navigate("/admin/compras/categorias");
  };

  if (loading) {
    return (
      <CrudLayout title="Cargando categoría...">
        <p>Cargando datos...</p>
      </CrudLayout>
    );
  }

  return (
    <CrudLayout
      title={
        mode === "crear"
          ? "Crear Categoría"
          : mode === "editar"
          ? "Editar Categoría"
          : "Detalle de la Categoría"
      }
      description={
        mode === "crear"
          ? "Complete los campos para registrar una nueva categoría."
          : mode === "editar"
          ? "Modifique los campos necesarios."
          : "Visualice toda la información de esta categoría."
      }
      hideAddButton={true}
    >
      <CategoriasForm
        mode={mode}
        initialData={categoriaData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/compras/categorias")}
      />
    </CrudLayout>
  );
}