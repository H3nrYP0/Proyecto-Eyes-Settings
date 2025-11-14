// src/features/servicios/pages/agenda/CrudAgenda.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import AgendaForm from "./AgendaForm";

// 🔗 Importamos mini-backend
import {
  getAgendaById,
  createAgenda,
  updateAgenda,
} from "../../../../lib/data/agendaData";

export default function CrudAgenda({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(mode !== "crear");
  const [agendaData, setAgendaData] = useState(null);

  // --- Cargar datos en editar/detalle ---
  useEffect(() => {
    if (mode === "crear") {
      setLoading(false);
      return;
    }

    const cita = getAgendaById(Number(id));

    if (!cita) {
      alert("❌ Esta cita no existe.");
      navigate("/admin/servicios/agenda");
      return;
    }

    setAgendaData(cita);
    setLoading(false);
  }, [mode, id, navigate]);

  // --- Guardado ---
  const handleSubmit = (data) => {
    if (mode === "crear") {
      createAgenda(data);
      alert("✅ Cita creada correctamente");
    } else {
      updateAgenda(Number(id), data);
      alert("✅ Cambios guardados correctamente");
    }

    navigate("/admin/servicios/agenda");
  };

  if (loading) {
    return (
      <CrudLayout title="Cargando cita...">
        <p>Cargando datos...</p>
      </CrudLayout>
    );
  }

  return (
    <CrudLayout
      title={
        mode === "crear"
          ? "Crear Cita"
          : mode === "editar"
          ? "Editar Cita"
          : "Detalle de la Cita"
      }
      description={
        mode === "crear"
          ? "Complete los campos para registrar una nueva cita."
          : mode === "editar"
          ? "Modifique los campos necesarios."
          : "Visualice toda la información de esta cita."
      }
    >
      <AgendaForm
        mode={mode}
        initialData={agendaData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/servicios/agenda")}
      />
    </CrudLayout>
  );
}
