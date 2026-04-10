import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllEmpleados } from "../../empleado/services/empleadosService";
import { ServicioData } from "../../servicio/services/serviciosService";
import { clientesService } from "../../../ventas/cliente/services/clientesService";
import { getAllEstadosCita } from "../services/estadosCitaServices";
import Loading from "../../../../shared/components/ui/Loading";
import { useCitaForm } from "../hooks/useCitaForm";
import CitaForm from "../components/CitaForm";

export default function CrearCita() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [clientesData, serviciosData, empleadosData, estadosData] = await Promise.all([
          clientesService.getAllClientes(),
          ServicioData.getAllServicios(),
          getAllEmpleados(),
          getAllEstadosCita()
        ]);

        setClientes(Array.isArray(clientesData) ? clientesData : []);
        setServicios(Array.isArray(serviciosData) ? serviciosData : []);
        
        const empleadosNormalizados = (Array.isArray(empleadosData) ? empleadosData : [])
          .map(e => ({ ...e, estado: e.estado === true ? "activo" : "inactivo" }));
        setEmpleados(empleadosNormalizados);
        
        setEstadosCita(Array.isArray(estadosData) ? estadosData : []);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("Error al cargar datos necesarios");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

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