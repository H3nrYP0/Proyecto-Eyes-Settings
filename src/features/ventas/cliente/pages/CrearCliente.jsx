import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ClienteForm from "../components/ClienteForm";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

export default function CrearCliente() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    message: "", type: "success", isVisible: false,
  });

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type, isVisible: true });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <>
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      <ClienteForm
        mode="create"
        title="Crear Cliente"
        onSubmit={() => {
          showNotification("Cliente creado exitosamente", "success");
          setTimeout(() => navigate("/admin/ventas/clientes"), 1000);
        }}
        onCancel={() => navigate("/admin/ventas/clientes")}
        onError={(msg) => showNotification(msg, "error")}
      />
    </>
  );
}