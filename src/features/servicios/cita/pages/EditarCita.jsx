import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCitaById } from "../services/citasService";
import { clientesService } from "../../../ventas/cliente/services/clientesService";
import { ServicioData } from "../../servicio/services/serviciosService";
import { getAllEmpleados } from "../../empleado/services/empleadosService";
import { getAllEstadosCita } from "../services/estadosCitaServices";
import { normalizeCitaForForm } from "../utils/citasUtils";
import Loading from "../../../../shared/components/ui/Loading";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import { useCitaForm } from "../hooks/useCitaForm";
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
  const [notificacion, setNotificacion] = useState({ visible: false, message: "", type: "success" });

  const showNotification = (message, type = "success") => {
    setNotificacion({ visible: true, message, type });
    setTimeout(() => setNotificacion(prev => ({ ...prev, visible: false })), 5000);
  };

  const closeNotification = () => setNotificacion(prev => ({ ...prev, visible: false }));

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [citaData, clientesData, serviciosData, empleadosData, estadosData] = await Promise.all([
          getCitaById(Number(id)),
          clientesService.getAllClientes(),
          ServicioData.getAllServicios(),
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
      } catch (err) {
        console.error("Error cargando datos:", err);
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, navigate]);

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
    setFormData,
    duracionActual,
    getClientesActivos,
    getServiciosActivos,
    getEmpleadosActivos,
    horaInvalida,
    getHoraErrorMessage,
    shouldDisableDate,
    shouldDisableTime,
  } = useCitaForm({
    mode: "edit",
    initialData: cita,
    clientes,
    servicios,
    empleados,
    estadosCita,
    onSubmitSuccess: () => {
      showNotification("Cita actualizada correctamente", "success");
      navigate("/admin/servicios/citas");
    },
    onError: (errorMsg) => {
      showNotification(errorMsg, "error");
    },
  });

  useEffect(() => {
    if (cita) {
      setFormData(cita);
    }
  }, [cita, setFormData]);

  if (loading) return <Loading message="Cargando datos de la cita..." />;

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <CrudNotification message={error} type="error" isVisible={true} onClose={() => {}} />
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => navigate("/admin/servicios/citas")} className="btn-primary">
            Volver a Citas
          </button>
        </div>
      </div>
    );
  }

  if (!cita) return null;

  return (
    <>
      <CrudNotification message={notificacion.message} type={notificacion.type} isVisible={notificacion.visible} onClose={closeNotification} />
      <CitaForm
        mode="edit"
        title="Editar Cita"
        onSubmit={() => {}}
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
    </>
  );
}