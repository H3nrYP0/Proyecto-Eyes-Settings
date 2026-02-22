import { useNavigate } from "react-router-dom";
import EmpleadoForm from "./components/empleadosForm";
import { createEmpleado } from "../../../../lib/data/empleadosData";

export default function CrearEmpleado() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      // El estado ya viene del formulario (por defecto "activo")
      await createEmpleado(data);
      navigate("/admin/servicios/empleados");
    } catch (error) {
      console.error("Error al crear empleado:", error);
      alert("Error al crear el empleado");
    }
  };

  return (
    <EmpleadoForm
      mode="create"
      title="Registrar Nuevo Empleado"
      onSubmit={handleCreate}
      onCancel={() => navigate("/admin/servicios/empleados")}
    />
  );
}