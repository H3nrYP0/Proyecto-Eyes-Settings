import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { clientesService } from "../services/clientesService";
import ClienteForm from "../components/ClienteForm";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

export default function EditarCliente() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    message: "", type: "success", isVisible: false,
  });

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type, isVisible: true });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  }, []);

  useEffect(() => {
    clientesService.getClienteById(Number(id))
      .then((data) => { setCliente(data); setLoading(false); })
      .catch(() => navigate("/admin/ventas/clientes"));
  }, [id, navigate]);

  if (loading) return (
    <div style={{ padding: "2rem", textAlign: "center" }}>Cargando cliente...</div>
  );
  if (!cliente) return null;

  return (
    <>
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      <ClienteForm
        mode="edit"
        title={`Editar Cliente: ${cliente.nombre} ${cliente.apellido}`}
        initialData={cliente}
        onSubmit={() => {
          showNotification("Cliente actualizado exitosamente", "success");
          setTimeout(() => navigate("/admin/ventas/clientes"), 1000);
        }}
        onCancel={() => navigate("/admin/ventas/clientes")}
        onError={(msg) => showNotification(msg, "error")}
      />
    </>
  );
}