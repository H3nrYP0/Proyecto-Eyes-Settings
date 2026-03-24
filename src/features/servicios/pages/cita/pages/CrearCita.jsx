import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllEmpleados } from "../../empleado/services/empleadosService";
import { getAllServicios } from "../../../../../lib/data/serviciosData";
import { getAllClientes } from "../../../../../lib/data/clientesData";
import { getAllEstadosCita } from "../../../../../lib/data/estadosCitaData";
import Loading from "../../../../../shared/components/ui/Loading";
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

  // ============================
  // Cargar datos de dependencias
  // ============================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [clientesData, serviciosData, empleadosData, estadosData] = await Promise.all([
          getAllClientes(),
          getAllServicios(),
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

  // ============================
  // Form hook
  // ============================
  const {
    formData,
    errors,
    submitting,
    verificando,
    disponibilidad,
    errorDisponibilidad,
    isAvailable,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
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
    />
  );
}