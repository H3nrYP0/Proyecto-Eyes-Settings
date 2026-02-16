import { useNavigate } from "react-router-dom";
import EmpleadoForm from "./components/empleadosForm";
import { createEmpleado } from "../../../../lib/data/empleadosData";

export default function CrearEmpleado() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    // Agregamos estado por defecto al empleado nuevo
    const empleadoConEstado = {
      ...data,
      estado: "activo",
    };

    await createEmpleado(empleadoConEstado);
    navigate("/admin/servicios/empleados");
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