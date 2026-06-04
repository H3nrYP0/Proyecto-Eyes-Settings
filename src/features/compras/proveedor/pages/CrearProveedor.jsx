import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProveedorForm from "../components/ProveedorForm";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

export default function CrearProveedor() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ isVisible: false, message: "", type: "success" });

  const showNotification = (message, type = "success") => {
    setNotification({ isVisible: true, message, type });
    setTimeout(() => {
      if (type === "success") navigate("/admin/compras/proveedores");
    }, 1500);
  };

  return (
    <>
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
      />
      <ProveedorForm
        mode="create"
        title="Crear Nuevo Proveedor"
        onCancel={() => navigate("/admin/compras/proveedores")}
        onSubmit={() => showNotification("Proveedor creado exitosamente", "success")}
        onError={(msg) => showNotification(msg, "error")}
      />
    </>
  );
}