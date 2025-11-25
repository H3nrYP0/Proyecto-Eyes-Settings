import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import HorariosForm from "./HorariosForm";

// Importamos mini-backend
import {
  getHorarioById,
  createHorario,
  updateHorario,
} from "../../../../lib/data/horariosData";

export default function CrudHorarios({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(mode !== "crear");
  const [horarioData, setHorarioData] = useState(null);

  // Cargar datos en editar/detalle
  useEffect(() => {
    if (mode === "crear") {
      setLoading(false);
      return;
    }

    const horario = getHorarioById(Number(id));

    if (!horario) {
      alert("❌ Este horario no existe.");
      navigate("/admin/servicios/horarios");
      return;
    }

    setHorarioData(horario);
    setLoading(false);
  }, [mode, id, navigate]);

  // Guardado
  const handleSubmit = (data) => {
    if (mode === "crear") {
      createHorario(data);
      alert("✅ Horario creado correctamente");
    } else {
      updateHorario(Number(id), data);
      alert("✅ Cambios guardados correctamente");
    }

    navigate("/admin/servicios/horarios");
  };

  if (loading) {
    return (
      <CrudLayout title="Cargando horario...">
        <p>Cargando datos...</p>
      </CrudLayout>
    );
  }

  return (
    <CrudLayout
      title={
        mode === "crear"
          ? "Crear Horario"
          : mode === "editar"
          ? "Editar Horario"
          : "Detalle del Horario"
      }
      description={
        mode === "crear"
          ? "Complete los campos para registrar un nuevo horario."
          : mode === "editar"
          ? "Modifique los campos necesarios."
          : "Visualice toda la información de este horario."
      }
      hideAddButton={true}
    >
      <HorariosForm
        mode={mode}
        initialData={horarioData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/servicios/horarios")}
      />
    </CrudLayout>
  );
}