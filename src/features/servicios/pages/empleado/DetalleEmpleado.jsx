import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEmpleadoById } from "../../../../lib/data/empleadosData";

import EmpleadoForm from "./components/empleadosForm";

export default function DetalleEmpleado() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEmpleado = async () => {
      try {
        const data = await getEmpleadoById(Number(id));

        if (!data) {
          navigate("/admin/servicios/empleados");
          return;
        }

        // Normalizar estado: true/false -> "activo"/"inactivo"
        const normalizado = {
          ...data,
          estado: data.estado === true ? "activo" : "inactivo",
        };

        setEmpleado(normalizado);
      } catch (error) {
        console.error("Error cargando empleado:", error);
        navigate("/admin/servicios/empleados");
      } finally {
        setLoading(false);
      }
    };

    cargarEmpleado();
  }, [id, navigate]);

  if (loading || !empleado) {
    return <div>Cargando...</div>;
  }

  return (
    <EmpleadoForm
      mode="view"
      title={`Detalle del Empleado: ${empleado.nombre}`}
      initialData={empleado}
      onCancel={() => navigate("/admin/servicios/empleados")}
      onEdit={() =>
        navigate(`/admin/servicios/empleados/editar/${empleado.id}`)
      }
    />
  );
}