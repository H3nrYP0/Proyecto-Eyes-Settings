import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCita } from "../../../../lib/data/citasData";
import { getAllClientes } from "../../../../lib/data/clientesData";
import { getAllServicios } from "../../../../lib/data/serviciosData";
import { getAllEmpleados } from "../../../../lib/data/empleadosData";
import { getAllEstadosCita } from "../../../../lib/data/estadosCitaData";
import Loading from "../../../../shared/components/ui/Loading";
import CitaForm from "./components/citasForm";

export default function CrearCita() {
  const navigate = useNavigate();
  
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔴 Estado para errores
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [clientesData, serviciosData, empleadosData, estadosData] = 
          await Promise.all([
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

  // 🔴 MODIFICADO: Manejar errores de validación
  const handleSubmit = async (data) => {
    try {
      const resultado = await createCita(data);
      
      if (resultado.success) {
        navigate("/admin/servicios/citas");
      } else {
        // Mostrar error específico del backend
        alert(`❌ ${resultado.error}`);
      }
    } catch (error) {
      console.error("Error creando cita:", error);
      alert("Error al crear la cita");
    }
  };

  if (loading) {
    return <Loading message="Cargando formulario de creación..." />;
  }

  return (
    <CitaForm
      mode="create"
      title="Nueva Cita"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/servicios/citas")}
      clientes={clientes}
      servicios={servicios}
      empleados={empleados}
      estadosCita={estadosCita}
    />
  );
}