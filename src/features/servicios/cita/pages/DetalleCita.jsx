import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCitaById } from "../services/citasService";
import { clientesService } from "../../../ventas/cliente/services/clientesService";
import { ServicioData } from "../../servicio/services/serviciosService";
import { getAllEmpleados } from "../../empleado/services/empleadosService";
import { normalizeCitaForForm } from "../utils/citasUtils";
import Loading from "../../../../shared/components/ui/Loading";
import CitaForm from "../components/CitaForm";
import { getAllEstadosCita } from "../services/estadosCitaServices";

export default function DetalleCita() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cita, setCita] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, navigate]);

  const handleChange = () => {};
  const handleDateChange = () => {};
  const handleTimeChange = () => {};
  const handleSubmit = async () => ({ success: true });

  if (loading) {
    return <Loading message="Cargando detalles de la cita..." />;
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

  const cliente = clientes.find(c => c.id === cita.cliente_id);
  const servicio = servicios.find(s => s.id === cita.servicio_id);
  const titulo = `Cita: ${cliente ? `${cliente.nombre} ${cliente.apellido || ''}` : 'Cliente'} - ${servicio ? servicio.nombre : 'Servicio'}`;

  return (
    <CitaForm
      mode="view"
      title={titulo}
      initialData={cita}
      onCancel={() => navigate("/admin/servicios/citas")}
      onEdit={() => navigate(`/admin/servicios/citas/editar/${cita.id}`)}
      clientes={clientes}
      servicios={servicios}
      empleados={empleados}
      estadosCita={estadosCita}
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
    />
  );
}