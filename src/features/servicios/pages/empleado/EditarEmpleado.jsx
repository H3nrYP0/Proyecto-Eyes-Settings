import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmpleadoForm from "./components/empleadosForm";
import Loading from "../../../../shared/components/ui/Loading"; // 👈 IMPORTAR

import {
  getEmpleadoById,
  updateEmpleado,
} from "../../../../lib/data/empleadosData";

export default function EditarEmpleado() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================
  // Cargar empleado (API)
  // ============================
  useEffect(() => {
    const cargarEmpleado = async () => {
      try {
        setLoading(true);
        setError(null);
        const empleadoData = await getEmpleadoById(Number(id));

        if (!empleadoData) {
          navigate("/admin/servicios/empleados");
          return;
        }

        // 👇 NORMALIZAR ESTADO: boolean -> string
        const empleadoNormalizado = {
          ...empleadoData,
          estado: empleadoData.estado === true ? "activo" : "inactivo"
        };

        setEmpleado(empleadoNormalizado);
      } catch (error) {
        console.error("Error cargando empleado:", error);
        setError("No se pudo cargar la información del empleado");
      } finally {
        setLoading(false);
      }
    };

    cargarEmpleado();
  }, [id, navigate]);

  // ============================
  // Guardar cambios
  // ============================
  const handleUpdate = async (data) => {
    try {
      // data ya viene con estado como string "activo"/"inactivo"
      await updateEmpleado(Number(id), data);
      navigate("/admin/servicios/empleados");
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      alert("Error al actualizar el empleado");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px' }}>
        <Loading message="Cargando información del empleado..." />
      </div>
    );
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
            onClick={() => navigate("/admin/servicios/empleados")}
            className="btn-primary"
          >
            Volver a Empleados
          </button>
        </div>
      </div>
    );
  }

  if (!empleado) {
    return null;
  }

  return (
    <EmpleadoForm
      mode="edit"
      title="Editar Empleado"
      initialData={empleado}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/admin/servicios/empleados")}
    />
  );
}