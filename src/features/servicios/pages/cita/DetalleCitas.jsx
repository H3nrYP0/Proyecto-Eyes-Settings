import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCitaById } from "../../../../lib/data/citasData";
import { getAllClientes } from "../../../../lib/data/clientesData";
import { getAllServicios } from "../../../../lib/data/serviciosData";
import { getAllEmpleados } from "../../../../lib/data/empleadosData";
import { getAllEstadosCita } from "../../../../lib/data/estadosCitaData";
import Loading from "../../../../shared/components/ui/Loading";
import CitaForm from "./components/citasForm";

export default function DetalleCita() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cita, setCita] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loading, setLoading] = useState(true);

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

        setCita(citaData);
        setClientes(Array.isArray(clientesData) ? clientesData : []);
        setServicios(Array.isArray(serviciosData) ? serviciosData : []);
        
        const empleadosNormalizados = (Array.isArray(empleadosData) ? empleadosData : []).map(e => ({
          ...e,
          estado: e.estado === true ? "activo" : "inactivo"
        }));
        setEmpleados(empleadosNormalizados);
        
        setEstadosCita(Array.isArray(estadosData) ? estadosData : []);
      } catch (error) {
        console.error("Error cargando datos:", error);
        navigate("/admin/servicios/citas");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, navigate]);

  if (loading) {
    return <Loading message="Cargando detalles de la cita..." />;
  }

  if (!cita) {
    return null;
  }

  const cliente = clientes.find(c => c.id === cita.cliente_id);
  const servicio = servicios.find(s => s.id === cita.servicio_id);
  const titulo = `Cita: ${cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente'} - ${servicio ? servicio.nombre : 'Servicio'}`;

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
    />
  );
}