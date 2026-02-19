import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CitaForm from "./components/citasForm";
import { createCita } from "../../../../lib/data/citasData";
import { getAllClientes } from "../../../../lib/data/clientesData";
import { getAllServicios } from "../../../../lib/data/serviciosData";
import { getAllEmpleados } from "../../../../lib/data/empleadosData";
import { getAllEstadosCita } from "../../../../lib/data/estadosCitaData";

export default function CrearCita() {
  const navigate = useNavigate();
  
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loading, setLoading] = useState(true);

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
        
        // Normalizar empleados
        const empleadosNormalizados = (Array.isArray(empleadosData) ? empleadosData : []).map(e => ({
          ...e,
          estado: e.estado === true ? "activo" : "inactivo"
        }));
        setEmpleados(empleadosNormalizados);
        
        setEstadosCita(Array.isArray(estadosData) ? estadosData : []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleCreate = async (data) => {
    await createCita(data);
    navigate("/admin/servicios/citas");
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <CitaForm
      mode="create"
      title="Registrar Nueva Cita"
      onSubmit={handleCreate}
      onCancel={() => navigate("/admin/servicios/citas")}
      clientes={clientes}
      servicios={servicios}
      empleados={empleados}
      estadosCita={estadosCita}
    />
  );
}