import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CitaForm from "./components/citasForm";
import {
  getCitaById,
  updateCita,
} from "../../../../lib/data/citasData";
import { getAllClientes } from "../../../../lib/data/clientesData";
import { getAllServicios } from "../../../../lib/data/serviciosData";
import { getAllEmpleados } from "../../../../lib/data/empleadosData";
import { getAllEstadosCita } from "../../../../lib/data/estadosCitaData";

export default function EditarCita() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleUpdate = async (data) => {
    await updateCita(Number(id), data);
    navigate("/admin/servicios/citas");
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <CitaForm
      mode="edit"
      title="Editar Cita"
      initialData={cita}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/admin/servicios/citas")}
      clientes={clientes}
      servicios={servicios}
      empleados={empleados}
      estadosCita={estadosCita}
    />
  );
}