import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ComprasForm from "../components/ComprasForm";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

export default function CrearCompra() {
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    isVisible: false, message: "", type: "success",
  });

  const showNotification = (message, type = "success") =>
    setNotification({ isVisible: true, message, type });

  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  const handleSubmit = (result) => {
    // onSubmitSuccess llega aquí con el resultado del backend
    sessionStorage.setItem(
      "crudNotification",
      JSON.stringify({ message: "Compra creada correctamente", type: "success" })
    );
    navigate("/admin/compras");
  };

  const handleError = (msg) => {
    showNotification(msg, "error");
  };

  return (
    <>
      <ComprasForm
        mode="create"
        title="Crear Nueva Compra"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/compras")}
        onError={handleError}
      />
      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </>
  );
}
