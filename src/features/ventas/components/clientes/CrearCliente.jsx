import { useNavigate } from "react-router-dom";
import ClientsForm from "./ClientsForm";
import { createCliente } from "../../../../lib/data/clientesData";

export default function CrearCliente() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      console.log("Datos recibidos del formulario:", data); // Para debug
      
      const resultado = await createCliente(data);
      console.log("Respuesta del servidor:", resultado); // Para debug
      
      navigate("/admin/ventas/clientes");
    } catch (error) {
      console.error("Error detallado al crear cliente:", error);
      
      // Mostrar mensaje de error más específico si está disponible
      if (error.response) {
        // El servidor respondió con un error
        console.error("Respuesta del servidor:", error.response.data);
        alert(`Error: ${error.response.data.error || error.response.data.message || "Error en el servidor"}`);
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        alert("Error: No se pudo conectar con el servidor");
      } else {
        // Error al configurar la petición
        alert(`Error al crear el cliente: ${error.message}`);
      }
    }
  };

  return (
    <ClientsForm
      mode="create"
      title="Crear Cliente"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/ventas/clientes")}
    />
  );
}