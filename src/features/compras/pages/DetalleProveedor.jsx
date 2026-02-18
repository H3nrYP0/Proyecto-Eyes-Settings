import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProveedorById } from "../../../lib/data/proveedoresData";

import ProveedorForm from "../components/ProveedoresForm";

export default function DetalleProveedor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [proveedor, setProveedor] = useState(null);

  useEffect(() => {
    const data = getProveedorById(Number(id));
    setProveedor(data);
  }, [id]);

  if (!proveedor) {
    return <div>Cargando...</div>;
  }

  return (
    <ProveedorForm
      mode="view"
      title={`Detalle del Proveedor: ${proveedor.razonSocial}`}
      initialData={proveedor}
      onCancel={() => navigate("/admin/compras/proveedores")}
      onEdit={() =>
        navigate(`/admin/compras/proveedores/editar/${proveedor.id}`)
      }
    />
  );
}