import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEmpleadoForm } from "../hooks/useEmpleadoForm";
import EmpleadoForm from "../components/EmpleadoForm";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

export default function CrearEmpleado() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ visible: false, message: "", type: "error" });

  const showNotification = (message, type = "error") => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 5000);
  };

  const {
    formData,
    errors,
    submitting,
    documentoExists,
    emailExists,
    handleChange,
    handleSubmit,
  } = useEmpleadoForm({
    mode: "create",
    onSubmitSuccess: () => {
      navigate("/admin/servicios/empleados");
    },
    onError: (error) => {
      showNotification(error, "error");
    },
  });

  return (
    <>
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
      />
      <EmpleadoForm
        mode="create"
        title="Registrar Nuevo Empleado"
        onSubmit={() => navigate("/admin/servicios/empleados")}
        onCancel={() => navigate("/admin/servicios/empleados")}
        formData={formData}
        errors={errors}
        submitting={submitting}
        documentoExists={documentoExists}
        emailExists={emailExists}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}