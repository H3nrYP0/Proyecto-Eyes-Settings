import { useNavigate } from "react-router-dom";
import ProveedorForm from "../components/ProveedoresForm";
import { ProveedoresData } from "../../../lib/data/proveedoresData";

export default function CrearProveedor() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      await ProveedoresData.createProveedor(data);
      navigate("/admin/compras/proveedores");
    } catch (error) {
      console.error("Error al crear proveedor:", error);
    }
  };

  return (
    <ProveedorForm
      mode="create"
      title="Crear Nuevo Proveedor"
      onSubmit={handleCreate}
      onCancel={() => navigate("/admin/compras/proveedores")}
    />
  );
}