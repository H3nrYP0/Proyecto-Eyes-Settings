import { useNavigate } from "react-router-dom";
import ProveedorForm from "../components/ProveedoresForm";
import { createProveedor } from "../../../lib/data/proveedoresData";

export default function CrearProveedor() {
  const navigate = useNavigate();

  const handleCreate = (data) => {
    const proveedorConEstado = {
      ...data,
      estado: true
    };

    createProveedor(proveedorConEstado);
    navigate("/admin/compras/proveedores");
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