import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import EmpleadosForm from "./EmpleadosForm";

// Importamos mini-backend
import {
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
} from "../../../../lib/data/empleadosData";

export default function CrudEmpleados({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(mode !== "crear");
  const [empleadoData, setEmpleadoData] = useState(null);

  // Cargar datos en editar/detalle
  useEffect(() => {
    if (mode === "crear") {
      setLoading(false);
      return;
    }

    const empleado = getEmpleadoById(Number(id));

    if (!empleado) {
      alert("❌ Este empleado no existe.");
      navigate("/admin/servicios/empleados");
      return;
    }

    setEmpleadoData(empleado);
    setLoading(false);
  }, [mode, id, navigate]);

  // Guardado
  const handleSubmit = (data) => {
    if (mode === "crear") {
      createEmpleado(data);
      alert("✅ Empleado creado correctamente");
    } else {
      updateEmpleado(Number(id), data);
      alert("✅ Cambios guardados correctamente");
    }

    navigate("/admin/servicios/empleados");
  };

  if (loading) {
    return (
      <CrudLayout title="Cargando empleado...">
        <p>Cargando datos...</p>
      </CrudLayout>
    );
  }

  return (
    <CrudLayout
      title={
        mode === "crear"
          ? "Crear Empleado"
          : mode === "editar"
          ? "Editar Empleado"
          : "Detalle del Empleado"
      }
      description={
        mode === "crear"
          ? "Complete los campos para registrar un nuevo empleado."
          : mode === "editar"
          ? "Modifique los campos necesarios."
          : "Visualice toda la información de este empleado."
      }
      hideAddButton={true}
    >
      <EmpleadosForm
        mode={mode}
        initialData={empleadoData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/servicios/empleados")}
      />
    </CrudLayout>
  );
}