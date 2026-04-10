import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCitaData } from '../context/CitaDataContext';
import Loading from "../../../../shared/components/ui/Loading";
import { useCitaForm } from "../hooks/useCitaForm";
import CitaForm from "../components/CitaForm";

export default function CrearCita() {
  const navigate = useNavigate();
  const { clientes, servicios, empleados, estadosCita, loading: dataLoading } = useCitaData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ya no necesitas cargar los datos maestros aquí, solo esperar a que el contexto termine
  useEffect(() => {
    if (!dataLoading) {
      setLoading(false);
    }
  }, [dataLoading]);

  const {
    formData,
    errors,
    submitting,
    verificando,
    disponibilidad,
    errorDisponibilidad,
    horariosEmpleado,
    diasActivos,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    getHorarioDelDia,
    duracionActual,
    getClientesActivos,
    getServiciosActivos,
    getEmpleadosActivos,
    horaInvalida,
    getHoraErrorMessage,
    shouldDisableDate,
    shouldDisableTime,
  } = useCitaForm({
    mode: "create",
    clientes,
    servicios,
    empleados,
    estadosCita,
    onSubmitSuccess: () => {
      navigate("/admin/servicios/citas");
    },
    onError: (error) => {
      alert(`❌ ${error}`);
    },
  });

  if (loading) {
    return <Loading message="Cargando formulario de creación..." />;
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#c62828" }}>
        ⚠️ {error}
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => navigate("/admin/servicios/citas")}
            className="btn-primary"
          >
            Volver a Citas
          </button>
        </div>
      </div>
    );
  }

  return (
    <CitaForm
      mode="create"
      title="Nueva Cita"
      onSubmit={() => navigate("/admin/servicios/citas")}
      onCancel={() => navigate("/admin/servicios/citas")}
      clientes={clientes}
      servicios={servicios}
      empleados={empleados}
      estadosCita={estadosCita}
      diasActivos={diasActivos}
      formData={formData}
      errors={errors}
      submitting={submitting}
      verificando={verificando}
      disponibilidad={disponibilidad}
      errorDisponibilidad={errorDisponibilidad}
      handleChange={handleChange}
      handleDateChange={handleDateChange}
      handleTimeChange={handleTimeChange}
      handleSubmit={handleSubmit}
      duracionActual={duracionActual}
      getClientesActivos={getClientesActivos}
      getServiciosActivos={getServiciosActivos}
      getEmpleadosActivos={getEmpleadosActivos}
      horaInvalida={horaInvalida}
      getHoraErrorMessage={getHoraErrorMessage}
      shouldDisableDate={shouldDisableDate}
      shouldDisableTime={shouldDisableTime}
    />
  );
}