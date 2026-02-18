import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProveedorById, updateProveedor } from "../../../lib/data/proveedoresData";

import ProveedorForm from "../components/ProveedoresForm";

export default function EditarProveedor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [proveedor, setProveedor] = useState(null);

  useEffect(() => {
    const data = getProveedorById(Number(id));
    setProveedor(data);
  }, [id]);

  const handleUpdate = (data) => {
    updateProveedor(Number(id), data);
    navigate("/admin/compras/proveedores");
  };

  if (!proveedor) {
    return <div>Cargando...</div>;
  }

  return (
    <ProveedorForm
      mode="edit"
      title={`Editar Proveedor: ${proveedor.razonSocial}`}
      initialData={proveedor}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/admin/compras/proveedores")}
    />
  );
}