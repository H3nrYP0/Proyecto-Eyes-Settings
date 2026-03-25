import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmpleadoById } from "../services/empleadosService";
import { normalizeEmpleadoForForm } from "../utils/empleadosUtils";
import EmpleadoForm from "../components/EmpleadoForm";
import Loading from "../../../../shared/components/ui/Loading";

export default function DetalleEmpleado() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================
  // Cargar empleado
  // ============================
  useEffect(() => {
    const cargarEmpleado = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEmpleadoById(Number(id));

        if (!data) {
          navigate("/admin/servicios/empleados");
          return;
        }

        const normalizado = normalizeEmpleadoForForm(data);
        setEmpleado(normalizado);
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
  // Handlers dummy para modo view
  // ============================
  const handleChange = () => {};
  const handleSubmit = async () => ({ success: true });

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <Loading message="Cargando información del empleado..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#c62828",
        }}
      >
        ⚠️ {error}
        <div style={{ marginTop: "20px" }}>
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
      mode="view"
      title={`Detalle del Empleado: ${empleado.nombre}`}
      initialData={empleado}
      onCancel={() => navigate("/admin/servicios/empleados")}
      onEdit={() => navigate(`/admin/servicios/empleados/editar/${empleado.id}`)}
      formData={empleado}
      errors={{}}
      submitting={false}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}