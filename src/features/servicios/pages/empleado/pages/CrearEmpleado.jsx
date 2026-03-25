import { useNavigate } from "react-router-dom";
import { useEmpleadoForm } from "../hooks/useEmpleadoForm";
import EmpleadoForm from "../components/EmpleadoForm";

export default function CrearEmpleado() {
  const navigate = useNavigate();

  const {
    formData,
    errors,
    submitting,
    handleChange,
    handleSubmit,
  } = useEmpleadoForm({
    mode: "create",
    onSubmitSuccess: () => {
      navigate("/admin/servicios/empleados");
    },
    onError: (error) => {
      alert(error);
    },
  });

  return (
    <EmpleadoForm
      mode="create"
      title="Registrar Nuevo Empleado"
      onSubmit={() => navigate("/admin/servicios/empleados")}
      onCancel={() => navigate("/admin/servicios/empleados")}
      formData={formData}
      errors={errors}
      submitting={submitting}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}