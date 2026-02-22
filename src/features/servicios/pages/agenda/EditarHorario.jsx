import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HorarioForm from "./components/HorarioForm";
import Loading from "../../../../shared/components/ui/Loading";

import {
  getHorarioById,
  updateHorario,
} from "../../../../lib/data/horariosData";

import { getAllEmpleados } from "../../../../lib/data/empleadosData";

export default function EditarHorario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [horario, setHorario] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================
  // Cargar horario y empleados
  // ============================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        const [empleadosData, horarioData] = await Promise.all([
          getAllEmpleados(),
          getHorarioById(Number(id))
        ]);

        setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);

        if (!horarioData) {
          navigate("/admin/servicios/agenda/horarios");
          return;
        }

        // Normalizar horario
        const horarioNormalizado = {
          id: horarioData.id,
          empleado_id: horarioData.empleado_id,
          dia: horarioData.dia,
          hora_inicio: horarioData.hora_inicio?.substring(0,5) || "",
          hora_final: horarioData.hora_final?.substring(0,5) || "",
          activo: horarioData.activo,
        };

        setHorario(horarioNormalizado);
      } catch (error) {
        console.error("Error cargando horario:", error);
        setError("No se pudo cargar la información del horario");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, navigate]);

  // ============================
  // Guardar cambios
  // ============================
  const handleUpdate = async (data) => {
    try {
      await updateHorario(Number(id), {
        empleado_id: Number(data.empleado_id),
        dia: Number(data.dia),
        hora_inicio: data.hora_inicio,
        hora_final: data.hora_final,
      });
      navigate("/admin/servicios/agenda/horarios");
    } catch (error) {
      console.error("Error al actualizar horario:", error);
      alert("Error al actualizar el horario");
    }
  };

  // ============================
  // MANEJO DE ESTADOS
  // ============================
  if (loading) {
    return <Loading message="Cargando información del horario..." />;
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        color: '#c62828'
      }}>
        ⚠️ {error}
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => navigate("/admin/servicios/agenda/horarios")}
            className="btn-primary"
          >
            Volver a Horarios
          </button>
        </div>
      </div>
    );
  }

  if (!horario) {
    return null;
  }

  // ============================
  // RENDER
  // ============================
  return (
    <HorarioForm
      mode="edit"
      title="Editar Horario"
      initialData={horario}
      empleados={empleados}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/admin/servicios/agenda/horarios")}
    />
  );
}