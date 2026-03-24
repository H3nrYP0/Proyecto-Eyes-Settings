import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCitaById } from "../services/citasService";
import { getAllClientes } from "../../../../../lib/data/clientesData";
import { getAllServicios } from "../../../../../lib/data/serviciosData";
import { getAllEmpleados } from "../../empleado/services/empleadosService";
import { getAllEstadosCita } from "../../../../../lib/data/estadosCitaData";
import { normalizeCitaForForm } from "../utils/citasUtils";
import Loading from "../../../../../shared/components/ui/Loading";
import { useCitaForm } from "../hooks/useCitaForm";
import CitaForm from "../components/CitaForm";

export default function EditarCita() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cita, setCita] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================
  // Cargar datos
  // ============================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [citaData, clientesData, serviciosData, empleadosData, estadosData] = await Promise.all([
          getCitaById(Number(id)),
          getAllClientes(),
          getAllServicios(),
          getAllEmpleados(),
          getAllEstadosCita()
        ]);

        if (!citaData) {
          navigate("/admin/servicios/citas");
          return;
        }

        setCita(normalizeCitaForForm(citaData));
        setClientes(Array.isArray(clientesData) ? clientesData : []);
        setServicios(Array.isArray(serviciosData) ? serviciosData : []);
        
        const empleadosNormalizados = (Array.isArray(empleadosData) ? empleadosData : [])
          .map(e => ({ ...e, estado: e.estado === true ? "activo" : "inactivo" }));
        setEmpleados(empleadosNormalizados);
        
        setEstadosCita(Array.isArray(estadosData) ? estadosData : []);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, navigate]);

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
    setFormData,
  } = useCitaForm({
    mode: "edit",
    initialData: cita,
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

  // Sincronizar cita con el formulario cuando se carga
  useEffect(() => {
    if (cita) {
      setFormData(cita);
    }
  }, [cita, setFormData]);

  if (loading) {
    return <Loading message="Cargando datos de la cita..." />;
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

  if (!cita) {
    return null;
  }

  return (
    <CitaForm
      mode="edit"
      title="Editar Cita"
      initialData={cita}
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