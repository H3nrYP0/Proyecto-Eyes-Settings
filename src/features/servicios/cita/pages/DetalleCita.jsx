import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCitaById } from "../services/citasService";
import { useCitaData } from '../context/CitaDataContext';
import { normalizeCitaForForm } from "../utils/citasUtils";
import Loading from "../../../../shared/components/ui/Loading";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import CitaForm from "../components/CitaForm";

const getErrorMessage = (error) => {
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return "No se pudo conectar con el servidor. Verifique su conexión a internet o intente más tarde.";
  }
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return "El servidor tardó demasiado en responder. Intente nuevamente.";
  }
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;
  return error.message || "Ocurrió un error inesperado.";
};

export default function DetalleCita() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { clientes, servicios, empleados, estadosCita, loading: dataLoading } = useCitaData();
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarCita = async () => {
      try {
        const citaData = await getCitaById(Number(id));
        if (!citaData) {
          navigate("/admin/servicios/citas");
          return;
        }
        setCita(normalizeCitaForForm(citaData));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    if (!dataLoading) {
      cargarCita();
    }
  }, [id, navigate, dataLoading]);

  // Handlers dummy para modo vista
  const handleChange = () => {};
  const handleDateChange = () => {};
  const handleTimeChange = () => {};
  const handleSubmit = async () => ({ success: true });

  // Funciones dummy para modo vista (no se usan pero son requeridas)
  const getClientesActivos = () => clientes;
  const getServiciosActivos = () => servicios;
  const getEmpleadosActivos = () => empleados;
  const getHoraErrorMessage = () => "";
  const shouldDisableDate = () => false;
  const shouldDisableTime = () => false;
  const duracionActual = cita?.duracion || null;
  const horaInvalida = false;

  if (loading) {
    return <Loading message="Cargando detalles de la cita..." />;
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <CrudNotification message={error} type="error" isVisible={true} onClose={() => {}} />
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

  const cliente = clientes.find(c => c.id === cita.cliente_id);
  const servicio = servicios.find(s => s.id === cita.servicio_id);
  const titulo = `Cita: ${cliente ? `${cliente.nombre} ${cliente.apellido || ''}` : 'Cliente'} - ${servicio ? servicio.nombre : 'Servicio'}`;

  return (
    <CitaForm
      mode="view"
      title={titulo}
      onCancel={() => navigate("/admin/servicios/citas")}
      onEdit={() => navigate(`/admin/servicios/citas/editar/${cita.id}`)}
      clientes={clientes}
      servicios={servicios}
      empleados={empleados}
      estadosCita={estadosCita}
      diasActivos={[]}
      formData={cita}
      errors={{}}
      submitting={false}
      verificando={false}
      disponibilidad={null}
      errorDisponibilidad=""
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