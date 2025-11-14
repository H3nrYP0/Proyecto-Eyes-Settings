// src/features/compras/pages/CrudCategoria.jsx
// PÁGINA PARA CREAR, EDITAR O VER DETALLE DE CATEGORÍAS

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import CategoriaForm from "./CategoriaForm";

export default function CrudCategoria({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Si estamos en editar o detalle → se carga la categoría
  const [loading, setLoading] = useState(mode !== "crear");
  const [categoriaData, setCategoriaData] = useState(null);

  // CARGAR DATOS EN EDITAR / DETALLE (SIMULADO)
  useEffect(() => {
    if ((mode === "editar" || mode === "detalle") && id) {
      setTimeout(() => {
        setCategoriaData({
          id,
          nombre: "Categoría de ejemplo",
          descripcion: "Descripción cargada desde datos simulados",
          estado: "activa",
        });
        setLoading(false);
      }, 300);
    } else {
      setLoading(false);
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
      title={
        mode === "crear"
          ? "Crear Categoría"
          : mode === "editar"
          ? "Editar Categoría"
          : "Detalle de Categoría"
      }
      description={
        mode === "crear"
          ? "Complete los campos para registrar una nueva categoría."
          : mode === "editar"
          ? "Modifique los campos necesarios y guarde los cambios."
          : "Visualice toda la información de esta categoría."
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
