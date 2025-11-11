// src/features/compras/pages/CrudCategoria.jsx
// PÁGINA PARA CREAR O EDITAR CATEGORÍAS

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import CategoriaForm from "./CategoriaForm";

export default function CrudCategoria({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(mode === "editar");
  const [categoriaData, setCategoriaData] = useState(null);

  // CARGAR DATOS EN MODO EDITAR (SIMULADO POR AHORA)
  useEffect(() => {
    if (mode === "editar" && id) {
      setTimeout(() => {
        setCategoriaData({
          id,
          nombre: "Categoría de ejemplo",
          descripcion: "Descripción cargada desde datos simulados",
          estado: "activa",
        });
        setLoading(false);
      }, 300);
    }
  }, [mode, id]);

  // SUBMIT DEL FORMULARIO
  const handleSubmit = (data) => {
    console.log("DATOS GUARDADOS:", data);

    alert(
      mode === "crear"
        ? "✅ Categoría creada correctamente"
        : "✅ Cambios guardados correctamente"
    );

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
      title={mode === "crear" ? "Crear Categoría" : "Editar Categoría"}
      description={
        mode === "crear"
          ? "Complete los campos para registrar una nueva categoría."
          : "Modifique los campos necesarios y guarde los cambios."
      }
    >
      <CategoriaForm
        mode={mode}
        initialData={categoriaData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/compras/categorias")}
      />
    </CrudLayout>
  );
}
