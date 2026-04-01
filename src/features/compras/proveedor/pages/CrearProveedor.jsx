import { useNavigate } from "react-router-dom";
import ProveedorForm from "../components/ProveedorForm";

export default function CrearProveedor() {
  const navigate = useNavigate();

  return (
    <ProveedorForm
      mode="create"
      title="Crear Nuevo Proveedor"
      onCancel={() => navigate("/admin/compras/proveedores")}
      onSubmit={() => navigate("/admin/compras/proveedores")}
    />
  );
}