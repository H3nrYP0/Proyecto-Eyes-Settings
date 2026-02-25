import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProveedorForm from "../components/ProveedoresForm";
import { ProveedoresData } from "../../../lib/data/proveedoresData";

export default function DetalleProveedor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProveedoresData.getProveedorById(Number(id))
      .then(setProveedor)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!proveedor) return <div>Proveedor no encontrado.</div>;

  return (
    <ProveedorForm
      mode="view"
      title={`Detalle del Proveedor: ${proveedor.razonSocial}`}
      initialData={proveedor}
      onCancel={() => navigate("/admin/compras/proveedores")}
      onEdit={() => navigate(`/admin/compras/proveedores/editar/${proveedor.id}`)}
    />
  );
}